## Kanban Platform (Backend Docker + Frontend local)

Plateforme Kanban modulaire. Le backend (Spring Boot 3 + PostgreSQL, et un service NestJS utilitaire) tourne sous Docker. Le frontend Next.js tourne en local dans le dossier `web` avec `npm run dev`.

### Prérequis
- Docker Desktop (ou Docker Engine) + Docker Compose
- Git Bash sous Windows (fourni avec Git pour Windows)
- Java 17 (JDK) installé pour les commandes Maven locales éventuelles
- Node.js 18+ et npm pour le frontend
- PostgreSQL 17

### 1) Cloner le projet
```bash
git clone https://github.com/<votre-compte>/<votre-repo>.git
cd veille-techno-backend
```

### 2) Lancer le backend en Docker
Depuis le dossier `spring-boot/`.
```bash
cd spring-boot
#glisser le fichier docker_start.sh dans votre terminal bash ou entrer la commande suivante dans le répertoire spring-boot :
docker compose up -d
```

- Spring Boot API: `http://localhost:8080/api` (Swagger)
- Actuator health: `http://localhost:8080/actuator/health`
- PostgreSQL exposé sur `localhost:5433`
- Broker Redis : localhost:6379
- NestJS : localhost:3001

Notes:
- Le fichier `spring-boot/docker-compose.yml` orchestre PostgreSQL, l’API Spring et le service NestJS.
- Les secrets JWT peuvent être fournis via variables d’environnement (ex: `APP_SECURITY_JWT_SECRET`).

### 3) Lancer le frontend en local
Depuis le dossier `web/`.
```bash
cd web
npm install
npm run dev
```

Par défaut: `http://localhost:3000`



### 4) Arrêt et maintenance
```bash
# Arrêter le backend Docker
cd spring-boot
docker compose down

# Nettoyer images/volumes (optionnel)
docker system prune -a --volumes
```

### Comptes de démo (seed)
Au démarrage, si moins de 10 utilisateurs existent, l’application crée des comptes:
- Emails: `user01@example.com` → `user10@example.com`
- Mot de passe: `Motdepasse123`
- Rôle: `USER`

### Endpoints principaux (extraits)
- Auth: `POST /api/auth/login`, `POST /api/auth/register`
- Users: `GET /api/users/me`, `PATCH /api/users/{id}`
- Lists: `POST /api/lists`, `DELETE /api/lists/{id}`
- Cards: `POST /api/lists/{listId}/cards`, `PATCH /api/cards/{id}`, `DELETE /api/cards/{id}`

Pour plus de détails, consultez Swagger: `http://localhost:8080/api`.
