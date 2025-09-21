# Multi-stage build pour optimiser la taille finale
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration Maven
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Télécharger les dépendances (layer cacheable)
RUN ./mvnw dependency:go-offline -B

# Copier le code source
COPY src ./src

# Build de l'application
RUN ./mvnw clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre-alpine AS runtime

# Sécurité : créer utilisateur non-root
RUN addgroup -g 1001 -S springboot && \
    adduser -S springboot -u 1001

# Installation de curl pour health check
RUN apk add --no-cache curl

WORKDIR /app

# Copier le JAR depuis l'étape de build
COPY --from=builder --chown=springboot:springboot /app/target/*.jar app.jar

# Créer le dossier logs avec les bonnes permissions
RUN mkdir -p logs && chown springboot:springboot logs

# Basculer vers l'utilisateur non-root
USER springboot

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Commande de démarrage avec profil Docker
CMD ["java", "-jar", "/app/app.jar", "--spring.profiles.active=docker"]
