#!/bin/bash

# Script de test pour vérifier la communication Redis entre Spring Boot et NestJS
# 🧪 Test Communication Microservices

set -e

echo "🧪 Test de Communication Microservices Redis"
echo "==========================================="

# Variables
SPRING_BOOT_URL="http://localhost:8080"
NESTJS_URL="http://localhost:3001"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

echo ""
print_info "Vérification de la disponibilité des services..."

# Test 1: Vérifier que les services sont démarrés
echo ""
echo "1. 🏥 Health Check des services"
echo "--------------------------------"

# Spring Boot Health
if curl -s "$SPRING_BOOT_URL/actuator/health" > /dev/null 2>&1; then
    print_result 0 "Spring Boot API (port 8080) - Disponible"
else
    print_result 1 "Spring Boot API (port 8080) - Indisponible"
    echo "   💡 Assurez-vous que Spring Boot est démarré avec 'docker-compose up spring-boot-api'"
    exit 1
fi

# NestJS Health
if curl -s "$NESTJS_URL/api/v1/health/simple" > /dev/null 2>&1; then
    print_result 0 "NestJS API (port 3001) - Disponible"
else
    print_result 1 "NestJS API (port 3001) - Indisponible"
    echo "   💡 Assurez-vous que NestJS est démarré avec 'docker-compose up nestjs-api'"
    exit 1
fi

# Test 2: Vérifier le statut Redis
echo ""
echo "2. 🔗 Statut des connexions Redis"
echo "----------------------------------"

# Spring Boot Redis Status
print_info "Vérification du statut Redis depuis Spring Boot..."
SPRING_REDIS_STATUS=$(curl -s "$SPRING_BOOT_URL/api/test/status")
echo "Response: $SPRING_REDIS_STATUS"

# NestJS Redis Status
print_info "Vérification du statut Redis depuis NestJS..."
NESTJS_REDIS_STATUS=$(curl -s "$NESTJS_URL/api/v1/redis/status")
echo "Response: $NESTJS_REDIS_STATUS"

# Test 3: Test de communication Spring Boot → NestJS
echo ""
echo "3. 📤 Test Spring Boot → NestJS"
echo "-------------------------------"

print_info "Publication d'un événement de test depuis Spring Boot..."
TEST_RESPONSE=$(curl -s -X POST "$SPRING_BOOT_URL/api/test/publish?message=Test%20from%20Spring%20Boot&userId=123")
echo "Response: $TEST_RESPONSE"

if echo "$TEST_RESPONSE" | grep -q '"success":true'; then
    print_result 0 "Événement publié depuis Spring Boot"
    print_info "Vérifiez les logs NestJS pour voir si l'événement a été reçu"
else
    print_result 1 "Échec de publication depuis Spring Boot"
fi

# Attendre un peu pour que le message soit traité
sleep 2

# Test 4: Test d'événement métier (CardCreated)
echo ""
echo "4. 🃏 Test événement métier (CardCreated)"
echo "-----------------------------------------"

print_info "Simulation de création d'une carte..."
CARD_RESPONSE=$(curl -s -X POST "$SPRING_BOOT_URL/api/test/card/create?title=Ma%20nouvelle%20carte&listId=1&userId=123")
echo "Response: $CARD_RESPONSE"

if echo "$CARD_RESPONSE" | grep -q '"success":true'; then
    print_result 0 "Événement CardCreated publié"
    print_info "Vérifiez les logs NestJS pour voir le traitement de l'événement"
else
    print_result 1 "Échec de publication CardCreated"
fi

# Test 5: Test de communication NestJS → Spring Boot (optionnel)
echo ""
echo "5. 📥 Test NestJS → Spring Boot (optionnel)"
echo "-------------------------------------------"

print_info "Publication d'un événement depuis NestJS..."
NESTJS_TEST_RESPONSE=$(curl -s -X POST "$NESTJS_URL/api/v1/redis/publish-test" \
    -H "Content-Type: application/json" \
    -d '{"message": "Test from NestJS", "userId": 456}')
echo "Response: $NESTJS_TEST_RESPONSE"

if echo "$NESTJS_TEST_RESPONSE" | grep -q '"success":true'; then
    print_result 0 "Événement publié depuis NestJS"
else
    print_result 1 "Échec de publication depuis NestJS"
fi

# Test 6: Vérification des logs
echo ""
echo "6. 📋 Recommandations pour vérifier les logs"
echo "---------------------------------------------"

print_info "Pour voir les logs en temps réel:"
echo "   Spring Boot: docker-compose logs -f spring-boot-api"
echo "   NestJS:      docker-compose logs -f nestjs-api"
echo "   Redis:       docker-compose logs -f redis"

print_info "Rechercher dans les logs:"
echo "   - 'Published event' (Spring Boot)"
echo "   - 'Received event' (NestJS)"
echo "   - 'Processing TestEvent' (NestJS)"
echo "   - 'Processing CardCreated' (NestJS)"

echo ""
echo "🎉 Test terminé !"
echo ""
print_info "Si tous les tests sont verts, la communication Redis fonctionne correctement !"
print_info "Sinon, vérifiez que tous les services (db, redis, spring-boot-api, nestjs-api) sont démarrés avec 'docker-compose ps'"
