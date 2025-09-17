## Suivi d'avancement – API Kanban (Spring Boot)

### Ce qui est en place
- **Projet Spring Boot**: Java 17, Spring Web, Spring Data JPA, Spring Security, Validation, `springdoc-openapi-starter-webmvc-ui`.
- **Base de données**: PostgreSQL via Docker Compose (port 5433), H2 dispo en runtime (pom) si besoin.
- **Swagger/OpenAPI**: configurée, UI accessible sous `/api`, docs sous `/api/docs`.
- **Sécurité JWT**:
  - Filtre `JwtAuthenticationFilter` branché avant `UsernamePasswordAuthenticationFilter`.
  - `CustomUserDetailsService` basé sur `UserRepository`.
  - `JwtService` (signature HS256, secret + expiration en properties).
  - Règles: `permitAll` sur `/api/auth/**`, `/api`, `/api/docs/**`, `/v3/api-docs/**`, `/swagger-ui/**`, le reste `authenticated`.
  - `httpBasic` et `formLogin` désactivés → plus de redirection vers `/login`; les endpoints protégés renvoient `401` sans UI de login.
  - Swagger UI reste public; l'autorisation se fait via le bouton "Authorize" avec un token JWT.

### Modèles (Entities)
- **User** (`id`, `email` unique, `password` hashé, `role`, `createdAt`, `updatedAt`).
- **KanbanList** (`id`, `title`, `position`, `owner` → `User`, `createdAt`, `updatedAt` avec `@PrePersist/@PreUpdate`).

### DTOs
- Auth: `RegisterRequest`, `LoginRequest` (validations Bean Validation).
- User: `UpdateUserRequest`, `UserResponse`.
- Lists: `ListCreateRequest`, `ListResponse`.
- Cards: `CardCreateRequest`, `CardUpdateRequest`, `CardResponse`.

### Repositories
- `UserRepository` (méthodes `findByEmail`, `existsByEmail`).
- `KanbanListRepository` (CRUD JpaRepository).
- `CardRepository` (CRUD JpaRepository, requêtes liées aux listes si besoin).

### Services
- `UserService` (save/find/findByEmail/existsByEmail/findAll).
- `KanbanListService` (save/findById/deleteById).
- `CardService` (create/update/delete, gestion de la position dans une liste).

### Contrôleurs et endpoints
- `AuthController` (`/api/auth`)
  - POST `/register`: inscription, rôle par défaut `ROLE_USER` si absent, retour `id/email`.
  - POST `/login`: authentification + génération de JWT via `JwtService`.
- `UserController` (`/api/users`)
  - GET `/me`: infos du user courant (via token).
  - PATCH `/{id}`: mise à jour email/password; mise à jour du rôle réservée à `ROLE_ADMIN`.
- `ListController` (`/api/lists`)
  - POST `/` : création d’une liste liée au user courant.
  - DELETE `/{id}` : suppression par propriétaire ou `ROLE_ADMIN`.
- `CardController`
  - POST `/api/lists/{listId}/cards` : création d’une carte dans une liste.
  - PATCH `/api/cards/{id}` : mise à jour d’une carte (titre, description, position, etc.).
  - DELETE `/api/cards/{id}` : suppression d’une carte.

### Configuration
- `application.properties`:
  - Datasource Postgres (jdbc:postgresql://localhost:5433/kanban, user/pass `kanban`).
  - JPA: `ddl-auto=update`, logs SQL formatés.
  - Swagger: `springdoc.api-docs.path=/api/docs`, `springdoc.swagger-ui.path=/api`.
  - JWT: `app.security.jwt.secret` (env var avec défaut), `app.security.jwt.expiration=3600000`.
  - Logs sécurité: niveau DEBUG.
- `docker-compose.yml`: service `db` (postgres:17), volume `pg_data`, healthcheck.
 - `SecurityConfig`: `SessionCreationPolicy.STATELESS`, `httpBasic().disable()`, `formLogin().disable()`, chaînes `permitAll` pour la doc Swagger.

### Reste à faire (prochaines étapes)
- **README**: guide de lancement et tests via Swagger.

### Endpoints clés (récap)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`.
- Users: `GET /api/users/me`, `PATCH /api/users/{id}`.
- Lists: `POST /api/lists`, `DELETE /api/lists/{id}`.
- Cards: `POST /api/lists/{listId}/cards`, `PATCH /api/cards/{id}`, `DELETE /api/cards/{id}`.


