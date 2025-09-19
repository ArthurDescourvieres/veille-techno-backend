## Kanban API (Spring Boot)

API REST de type Kanban (utilisateurs, listes, cartes) développée avec Spring Boot 3. Swagger est disponible pour tester les endpoints.

### Prérequis
- Java 17 (JDK)
- Docker Desktop (ou Docker Engine) + Docker Compose
- Git Bash sous Windows (fourni avec Git pour Windows)

### 1) Cloner le projet
```bash
git clone https://github.com/<votre-compte>/<votre-repo>.git
cd veille-techno-backend/spring-boot
```

### 2) Démarrer la base de données PostgreSQL (Docker)
Le fichier `spring-boot/docker-compose.yml` expose Postgres en local sur le port 5433 et crée la base `kanban` avec l’utilisateur/mot de passe `kanban/kanban`.

```bash
cd spring-boot
docker compose up -d
# Vérifier que le conteneur est healthy
docker ps
```

La configuration côté application est déjà pointée vers `jdbc:postgresql://localhost:5433/kanban`.

### 3) Générer et fournir le secret JWT
L’application attend une variable d’environnement `APP_SECURITY_JWT_SECRET`. Utilisez un secret d’au moins 32 octets.

- Git Bash (recommandé):
```bash
export APP_SECURITY_JWT_SECRET=$(openssl rand -base64 64)
# Vous pouvez générer un secret avec cette commande
```

Remarque: vous pouvez aussi fournir une valeur fixe tant qu’elle est longue (≥ 32 octets), par exemple une chaîne base64/hex suffisamment longue.

### 4) Installer les dépendances et lancer l'API backend
Depuis le dossier `spring-boot`:

```bash
# Installer les dépendances Maven
./mvnw clean install

# Lancer l'API en mode développement
./mvnw spring-boot:run
```

Par défaut, l’API écoute sur `http://localhost:8080/api`.



### 6) Comptes de démo (seed)
Au démarrage, si moins de 10 utilisateurs existent, l’application crée des comptes:
- Emails: `user01@example.com` → `user10@example.com`
- Mot de passe: `Motdepasse123`
- Rôle: `USER`


### 8) Arrêter la base de données
```bash
cd spring-boot
docker compose down
```

### Modèle de données et rôles

#### Tables principales
- **users**
  - `id`
  - `email` *(unique)*
  - `password` *(hashé)*
  - `role`

- **kanban_lists**
  - `id`
  - `title`
  - `position`
  - `owner_id` *(FK → users.id)*

- **cards**
  - `id`
  - `title`
  - `description`
  - `position`
  - `list_id` *(FK → kanban_lists.id)*

---

#### Rôles du projet
- **USER**
  - **Authentification**  
    - Inscription → `POST /api/auth/register`  
    - Connexion → `POST /api/auth/login`  
    - Usage du JWT  
  - **Listes**  
    - Créer et supprimer ses propres listes  
  - **Cartes**  
    - Créer, modifier et supprimer des cartes dans ses propres listes  
  - **Profil**  
    - Modifier ses informations (dans les limites prévues)  

- **ADMIN**
  - Dispose de tous les droits d’un **USER**  
  - **Gestion utilisateurs**  
    - Mettre à jour informations et rôles → `PATCH /api/users/{id}`  
  - **Administration globale**  
    - Peut gérer toutes les listes et cartes si nécessaire  
