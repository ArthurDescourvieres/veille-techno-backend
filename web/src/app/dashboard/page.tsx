"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface User {
  id: number;
  email: string;
  role: string;
}

// Types pour le Kanban
interface KanbanCard {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: "low" | "medium" | "high";
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

// Données mockées
const mockData: KanbanColumn[] = [
  {
    id: "todo",
    title: "À faire",
    cards: [
      {
        id: "card-1",
        title: "Implémenter l'authentification",
        description: "Mettre en place JWT et refresh tokens",
        assignee: "Arthur",
        priority: "high"
      },
      {
        id: "card-2",
        title: "Créer les modèles de données",
        description: "Définir les entités JPA pour le Kanban",
        assignee: "Arthur",
        priority: "medium"
      },
      {
        id: "card-3",
        title: "Configuration Docker",
        description: "Setup docker-compose pour dev",
        priority: "low"
      }
    ]
  },
  {
    id: "inprogress",
    title: "En cours",
    cards: [
      {
        id: "card-4",
        title: "API REST Controllers",
        description: "Développement des endpoints CRUD",
        assignee: "Arthur",
        priority: "high"
      },
      {
        id: "card-5",
        title: "Tests d'intégration",
        description: "Tests avec Testcontainers",
        priority: "medium"
      }
    ]
  },
  {
    id: "review",
    title: "En review",
    cards: [
      {
        id: "card-6",
        title: "Documentation OpenAPI",
        description: "Génération automatique des specs",
        assignee: "Arthur",
        priority: "medium"
      }
    ]
  },
  {
    id: "done",
    title: "Terminé",
    cards: [
      {
        id: "card-7",
        title: "Setup projet Spring Boot",
        description: "Configuration initiale avec PostgreSQL",
        assignee: "Arthur",
        priority: "high"
      },
      {
        id: "card-8",
        title: "Configuration base de données",
        description: "Setup Flyway et migrations",
        priority: "medium"
      }
    ]
  }
];

// Composant Card draggable
function DraggableCard({ card }: { card: KanbanCard }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 cursor-grab hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{card.title}</h4>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${
            priorityColors[card.priority]
          }`}
        >
          {card.priority === "low" ? "Faible" : card.priority === "medium" ? "Moyen" : "Élevé"}
        </span>
      </div>
      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{card.description}</p>
      {card.assignee && (
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {card.assignee.charAt(0).toUpperCase()}
          </div>
          <span className="ml-2 text-xs text-gray-600">{card.assignee}</span>
        </div>
      )}
    </div>
  );
}

// Composant Column
function KanbanColumnComponent({ column, cards }: { column: KanbanColumn; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-4 min-h-[500px] w-80 transition-colors ${
        isOver ? "bg-blue-50 border-2 border-blue-300" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
          {cards.length}
        </span>
      </div>
      <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[400px]">
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} />
          ))}
          {cards.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              Déposez une card ici
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  
  // État pour les colonnes Kanban
  const [columns, setColumns] = React.useState<KanbanColumn[]>(mockData);
  const [activeCard, setActiveCard] = React.useState<KanbanCard | null>(null);
  
  // Configuration des capteurs pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Gestion du début de drag
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = findCardById(active.id as string);
    setActiveCard(card || null);
  };

  // Gestion de la fin de drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Si on drop sur une card, on récupère sa colonne
    const activeCard = findCardById(activeId);
    const overCard = findCardById(overId);
    
    if (!activeCard) return;

    const activeColumn = findColumnByCardId(activeId);
    const overColumn = overCard ? findColumnByCardId(overId) : findColumnById(overId);

    if (!activeColumn || !overColumn) return;

    // Si on change de colonne
    if (activeColumn.id !== overColumn.id) {
      setColumns((prevColumns) => {
        return prevColumns.map((column) => {
          if (column.id === activeColumn.id) {
            // Retirer la card de la colonne source
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== activeId),
            };
          }
          if (column.id === overColumn.id) {
            // Ajouter la card à la colonne cible
            return {
              ...column,
              cards: [...column.cards, activeCard],
            };
          }
          return column;
        });
      });
    }
  };

  // Fonction utilitaires
  const findCardById = (id: string): KanbanCard | undefined => {
    for (const column of columns) {
      const card = column.cards.find((card) => card.id === id);
      if (card) return card;
    }
  };

  const findColumnByCardId = (cardId: string): KanbanColumn | undefined => {
    return columns.find((column) =>
      column.cards.some((card) => card.id === cardId)
    );
  };

  const findColumnById = (id: string): KanbanColumn | undefined => {
    return columns.find((column) => column.id === id);
  };

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Type guard pour s'assurer que user existe
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Kanban Board</h1>
              <p className="text-sm text-gray-600">Test du Drag & Drop</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que <strong>{user.email}</strong>
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <KanbanColumnComponent
                key={column.id}
                column={column}
                cards={column.cards}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeCard ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 cursor-grabbing transform rotate-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{activeCard.title}</h4>
                  <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800">
                    {activeCard.priority === "low" ? "Faible" : activeCard.priority === "medium" ? "Moyen" : "Élevé"}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mb-2">{activeCard.description}</p>
                {activeCard.assignee && (
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {activeCard.assignee.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 text-xs text-gray-600">{activeCard.assignee}</span>
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
