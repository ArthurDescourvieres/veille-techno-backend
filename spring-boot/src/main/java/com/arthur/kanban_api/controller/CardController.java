package com.arthur.kanban_api.controller;

import com.arthur.kanban_api.dto.CardCreateRequest;
import com.arthur.kanban_api.dto.CardResponse;
import com.arthur.kanban_api.dto.CardUpdateRequest;
import com.arthur.kanban_api.entity.Card;
import com.arthur.kanban_api.entity.KanbanList;
import com.arthur.kanban_api.entity.User;
import com.arthur.kanban_api.service.CardService;
import com.arthur.kanban_api.service.KanbanListService;
import com.arthur.kanban_api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Cards", description = "Endpoints de gestion des cartes Kanban")
public class CardController {

    private final CardService cardService;
    private final KanbanListService listService;
    private final UserService userService;

    public CardController(CardService cardService, KanbanListService listService, UserService userService) {
        this.cardService = cardService;
        this.listService = listService;
        this.userService = userService;
    }

    @PostMapping("/lists/{listId}/cards")
    @Operation(summary = "Créer une carte", description = "Crée une carte dans une liste appartenant à l'utilisateur connecté")
    public ResponseEntity<?> create(@PathVariable Long listId,
                                    @Valid @RequestBody CardCreateRequest request,
                                    Authentication authentication) {
        String email = authentication.getName();
        User owner = userService.findByEmail(email).orElse(null);
        if (owner == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Utilisateur non trouvé"));
        }

        KanbanList list = listService.findById(listId).orElse(null);
        if (list == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Liste non trouvée"));
        }

        boolean isOwner = list.getOwner().getId().equals(owner.getId());
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(403).body(Map.of("error", "Accès refusé"));
        }

        Card card = new Card();
        card.setTitle(request.getTitle().trim());
        card.setDescription(request.getDescription());
        card.setPosition(request.getPosition());
        card.setList(list);
        card.setOwner(owner);
        Card saved = cardService.save(card);
        return ResponseEntity.created(URI.create("/api/cards/" + saved.getId())).body(toResponse(saved));
    }

    @PatchMapping("/cards/{id}")
    @Operation(summary = "Modifier une carte", description = "Modifie les champs d'une carte si on est propriétaire ou admin")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @Valid @RequestBody CardUpdateRequest request,
                                    Authentication authentication) {
        return cardService.findById(id).map(existing -> {
            String requesterEmail = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = existing.getOwner().getEmail().equalsIgnoreCase(requesterEmail);
            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Accès refusé"));
            }

            if (request.getTitle() != null && !request.getTitle().isBlank()) {
                existing.setTitle(request.getTitle().trim());
            }

            if (request.getDescription() != null) {
                existing.setDescription(request.getDescription());
            }

            if (request.getPosition() != null) {
                existing.setPosition(request.getPosition());
            }

            if (request.getListId() != null) {
                KanbanList newList = listService.findById(request.getListId()).orElse(null);
                if (newList == null) {
                    return ResponseEntity.status(404).body(Map.of("error", "Nouvelle liste non trouvée"));
                }
                // Autoriser le déplacement uniquement si la nouvelle liste appartient au même owner ou admin
                boolean newListOwner = newList.getOwner().getEmail().equalsIgnoreCase(requesterEmail);
                if (!newListOwner && !isAdmin) {
                    return ResponseEntity.status(403).body(Map.of("error", "Accès refusé pour déplacer la carte"));
                }
                existing.setList(newList);
            }

            Card saved = cardService.save(existing);
            return ResponseEntity.ok(toResponse(saved));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Carte non trouvée")));
    }

    @DeleteMapping("/cards/{id}")
    @Operation(summary = "Supprimer une carte", description = "Supprime une carte si on est propriétaire ou admin")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        return cardService.findById(id).map(existing -> {
            String requesterEmail = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = existing.getOwner().getEmail().equalsIgnoreCase(requesterEmail);
            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Accès refusé"));
            }
            cardService.delete(existing);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Carte non trouvée")));
    }

    private CardResponse toResponse(Card card) {
        return new CardResponse(
                card.getId(),
                card.getTitle(),
                card.getDescription(),
                card.getPosition(),
                card.getList().getId(),
                card.getOwner().getId(),
                card.getCreatedAt(),
                card.getUpdatedAt()
        );
    }
}


