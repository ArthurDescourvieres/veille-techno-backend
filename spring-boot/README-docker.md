# 🐳 Configuration Docker - Kanban API

## TL;DR
Environnement Dockerisé complet avec PostgreSQL, NestJS et Spring Boot sur le même réseau.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   PostgreSQL    │    │    NestJS API    │    │  Spring Boot API    │
│   Port: 5433    │◄──►│   Port: 3001     │    │    Port: 8080       │
│                 │    │                  │    │                     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         └────────── kanban-network ──────────────────────┘
```

## Services

| Service | Port | Health Check | Swagger |
|---------|------|--------------|---------|
| PostgreSQL | 5433 | `pg_isready` | - |
| NestJS | 3001 | `/api/v1/health/simple` | - |
| Spring Boot | 8080 | `/actuator/health` | `/api` |

## Démarrage rapide

```bash
# Depuis le dossier spring-boot/
./docker-start.sh
```

## Commandes manuelles

```bash
# Construction
docker-compose build

# Démarrage
docker-compose up -d

# Logs
docker-compose logs -f spring-boot-api
docker-compose logs -f nestjs-api

# Status
docker-compose ps

# Arrêt
docker-compose down
```

## Configuration

### Variables d'environnement

Créer `.env` dans `spring-boot/` :

```env
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
JWT_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000
```

### Profils Spring Boot

- **Développement local**: `application.properties` (port 5433)
- **Docker**: `application-docker.properties` (host `db`, port 5432)

## Vérification

### Health Checks

```bash
# PostgreSQL
docker-compose exec db pg_isready -U kanban -d kanban

# NestJS
curl http://localhost:3001/api/v1/health/simple

# Spring Boot
curl http://localhost:8080/actuator/health
```

### APIs

- **NestJS**: http://localhost:3001
- **Spring Boot**: http://localhost:8080
- **Swagger**: http://localhost:8080/api

## Troubleshooting

### PostgreSQL
```bash
# Logs détaillés
docker-compose logs db

# Connexion directe
docker-compose exec db psql -U kanban -d kanban
```

### Spring Boot
```bash
# Logs avec niveau DEBUG
docker-compose logs spring-boot-api | grep ERROR

# Vérifier la connectivité DB
docker-compose exec spring-boot-api curl -f http://localhost:8080/actuator/health
```

### NestJS
```bash
# Status détaillé
docker-compose exec nestjs-api wget -qO- http://localhost:3001/api/v1/health/simple
```

## Nettoyage

```bash
# Arrêt complet
docker-compose down -v

# Suppression des images
docker-compose down --rmi all

# Nettoyage système
docker system prune -a
```
