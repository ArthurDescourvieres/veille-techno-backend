# Commandes de base Spring Boot

## 🚀 Commandes Maven (dans le dossier du projet)

### Compilation et exécution
```bash
# Compiler le projet
mvn compile

# Exécuter l'application
mvn spring-boot:run

# Compiler et exécuter en une fois
mvn clean spring-boot:run
```

### Tests
```bash
# Lancer tous les tests
mvn test

# Lancer un test spécifique
mvn test -Dtest=NomDuTest
```

### Package et déploiement
```bash
# Créer un JAR exécutable
mvn clean package

# Exécuter le JAR
java -jar target/kanban-api-0.0.1-SNAPSHOT.jar
```

## 🛠️ Commandes de développement

### Nettoyage
```bash
# Nettoyer les fichiers compilés
mvn clean

# Nettoyer et recompiler
mvn clean compile
```

### Dépendances
```bash
# Télécharger les dépendances
mvn dependency:resolve

# Voir l'arbre des dépendances
mvn dependency:tree
```

## 📊 Commandes utiles

### Informations sur le projet
```bash
# Voir les propriétés du projet
mvn help:effective-pom

# Voir la version de Maven
mvn --version
```

### Base de données
```bash
# Accéder à la console H2 (si activée)
# Ouvrir : http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:testdb
# Username: sa
# Password: (vide)
```

## 🌐 URLs importantes

### Application
- **Application** : http://localhost:8080
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **Actuator** : http://localhost:8080/actuator

### Base de données H2
- **Console H2** : http://localhost:8080/h2-console

## ⚠️ Notes importantes

1. **Toujours exécuter les commandes dans le dossier du projet** (là où se trouve le fichier `pom.xml`)
2. **Pour votre projet** : `cd spring-boot/kanban-api/kanban-api/`
3. **Port par défaut** : 8080
4. **Base de données H2** : en mémoire (données perdues au redémarrage)

## 🔧 Commandes de dépannage

### Problèmes courants
```bash
# Vider le cache Maven
mvn clean

# Forcer le téléchargement des dépendances
mvn clean install -U

# Voir les logs détaillés
mvn spring-boot:run -X
```

### Vérification
```bash
# Vérifier que l'application démarre
curl http://localhost:8080/actuator/health

# Vérifier les endpoints disponibles
curl http://localhost:8080/actuator
```

