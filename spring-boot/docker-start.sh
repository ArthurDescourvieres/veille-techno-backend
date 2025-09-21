#!/bin/bash

# Script de démarrage Docker pour l'environnement Kanban complet
# (PostgreSQL + NestJS + Spring Boot)

set -e

echo "🐳 Démarrage de l'environnement Kanban complet..."

# Vérification des prérequis
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Nettoyage optionnel (décommenter si nécessaire)
# echo "🧹 Nettoyage des anciens conteneurs..."
# docker-compose down -v

# Construction et démarrage
echo "🏗️  Construction des images..."
docker-compose build --no-cache

echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérification des services
echo "🔍 Vérification de l'état des services..."

# PostgreSQL
if docker-compose exec -T db pg_isready -U kanban -d kanban &> /dev/null; then
    echo "✅ PostgreSQL: Opérationnel"
else
    echo "❌ PostgreSQL: Non disponible"
fi

# NestJS
if curl -s http://localhost:3001/api/v1/health/simple &> /dev/null; then
    echo "✅ NestJS API: Opérationnel (http://localhost:3001)"
else
    echo "⚠️  NestJS API: En cours de démarrage... (http://localhost:3001)"
fi

# Spring Boot
if curl -s http://localhost:8080/actuator/health &> /dev/null; then
    echo "✅ Spring Boot API: Opérationnel (http://localhost:8080)"
else
    echo "⚠️  Spring Boot API: En cours de démarrage... (http://localhost:8080)"
fi

echo ""
echo "🎉 Environnement démarré !"
echo ""
echo "📋 Services disponibles:"
echo "   • PostgreSQL: localhost:5433"
echo "   • NestJS API: http://localhost:3001"
echo "   • Spring Boot API: http://localhost:8080"
echo "   • Swagger UI Spring Boot: http://localhost:8080/api"

