package com.arthur.kanban_api.controller;

import com.arthur.kanban_api.service.EventPublisherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur de test pour vérifier la communication Redis entre microservices
 */
@RestController
@RequestMapping("/api/test")
@Tag(name = "Event Test", description = "Endpoints de test pour la communication inter-microservices")
public class EventTestController {

    private static final Logger logger = LoggerFactory.getLogger(EventTestController.class);

    private final EventPublisherService eventPublisher;

    @Autowired
    public EventTestController(EventPublisherService eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    /**
     * Endpoint pour tester la publication d'événements vers NestJS
     */
    @PostMapping("/publish")
    @Operation(
        summary = "Publier un événement de test",
        description = "Publie un événement de test vers Redis pour vérifier la communication avec NestJS"
    )
    @ApiResponse(responseCode = "200", description = "Événement publié avec succès")
    @ApiResponse(responseCode = "500", description = "Erreur lors de la publication")
    public ResponseEntity<Map<String, Object>> publishTestEvent(
            @Parameter(description = "Message de test à publier")
            @RequestParam(defaultValue = "Hello from Spring Boot!") String message,
            
            @Parameter(description = "ID utilisateur pour les métadonnées")
            @RequestParam(required = false) Long userId) {
        
        try {
            logger.info("Publishing test event with message: {}", message);
            
            eventPublisher.publishTestEvent(message, userId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Test event published successfully",
                "data", Map.of(
                    "testMessage", message,
                    "userId", userId != null ? userId : "anonymous",
                    "timestamp", System.currentTimeMillis()
                )
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to publish test event", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish test event: " + e.getMessage(),
                "error", e.getClass().getSimpleName()
            );
            
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Endpoint pour simuler la création d'une carte (événement métier)
     */
    @PostMapping("/card/create")
    @Operation(
        summary = "Simuler la création d'une carte",
        description = "Publie un événement CardCreated pour tester la communication métier"
    )
    @ApiResponse(responseCode = "200", description = "Événement CardCreated publié")
    public ResponseEntity<Map<String, Object>> simulateCardCreation(
            @Parameter(description = "Titre de la carte")
            @RequestParam(defaultValue = "Carte de test") String title,
            
            @Parameter(description = "ID de la liste")
            @RequestParam(defaultValue = "1") Long listId,
            
            @Parameter(description = "ID utilisateur")
            @RequestParam(defaultValue = "1") Long userId) {
        
        try {
            // Simuler un ID de carte
            Long cardId = System.currentTimeMillis() % 10000;
            
            logger.info("Simulating card creation: {} (ID: {})", title, cardId);
            
            eventPublisher.publishCardCreated(cardId, title, listId, userId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "CardCreated event published successfully",
                "data", Map.of(
                    "cardId", cardId,
                    "title", title,
                    "listId", listId,
                    "userId", userId
                )
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to publish CardCreated event", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish CardCreated event: " + e.getMessage()
            );
            
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Endpoint pour vérifier le statut de Redis
     */
    @GetMapping("/status")
    @Operation(
        summary = "Vérifier le statut Redis",
        description = "Retourne le statut de la connexion Redis"
    )
    public ResponseEntity<Map<String, Object>> getRedisStatus() {
        try {
            Map<String, Object> response = Map.of(
                "redis", "connected",
                "publisher", "ready",
                "service", "spring-boot-api",
                "timestamp", System.currentTimeMillis()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "redis", "error",
                "message", e.getMessage()
            );
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
