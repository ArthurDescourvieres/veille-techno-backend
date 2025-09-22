# Multi-stage build pour optimiser la taille finale
FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runtime

# Sécurité : créer utilisateur non-root
RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001

# Installation de wget pour health check
RUN apk add --no-cache wget

WORKDIR /app

# Copier les artifacts depuis les étapes précédentes
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
COPY --from=dependencies --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --chown=nestjs:nestjs package.json ./

# Créer le dossier logs avec les bonnes permissions
RUN mkdir -p logs && chown nestjs:nestjs logs

# Basculer vers l'utilisateur non-root
USER nestjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/v1/health/simple || exit 1

# Commande de démarrage
CMD ["node", "dist/main.js"]