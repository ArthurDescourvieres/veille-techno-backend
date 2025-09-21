# NestJS Service - Kanban API

## 🚀 Démarrage rapide

```bash
# Construire et lancer tous les services
docker-compose up --build -d

# Vérifier le statut
docker-compose ps
docker-compose logs nestjs-api

# Arrêter les services
docker-compose down
```

## 📋 Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| PostgreSQL | `localhost:5433` | Base de données partagée |
| NestJS API | `http://localhost:3001/api/v1` | Service de notifications |

## 🔍 Endpoints de test

```bash
# Health checks
curl http://localhost:3001/api/v1/health/simple
curl http://localhost:3001/api/v1/health

# API Notifications
curl http://localhost:3001/api/v1/notifications/test
curl http://localhost:3001/api/v1/notifications

# Créer une notification
curl -X POST http://localhost:3001/api/v1/notifications \
  -H "Content-Type: application/json" \
  -d '{"message": "Test notification", "type": "info"}'
```

## 🛠️ Développement

```bash
cd spring-boot/nestjs

# Installer les dépendances
npm install

# Mode développement (hors Docker)
npm run start:dev

# Build de production
npm run build
```

## 📁 Structure

```
spring-boot/
├── docker-compose.yml      # Services PostgreSQL + NestJS
├── .env                    # Variables d'environnement
└── nestjs/                 # Service NestJS
    ├── Dockerfile
    ├── src/
    │   ├── health/        # Health checks
    │   ├── notifications/ # API notifications
    │   └── main.ts       # Point d'entrée
    └── logs/             # Logs du container
```

## 🔧 Configuration

Variables dans `.env` :
- `JWT_SECRET` : Clé JWT partagée avec Spring Boot
- `DB_HOST/PORT` : Configuration PostgreSQL
- `NODE_ENV` : Environnement (development/production)

## 🐛 Debug

```bash
# Logs en temps réel
docker-compose logs -f nestjs-api

# Connexion au container
docker exec -it kanban_nestjs sh

# Vérifier la base de données
docker exec -it kanban_postgres psql -U kanban -d kanban
```
