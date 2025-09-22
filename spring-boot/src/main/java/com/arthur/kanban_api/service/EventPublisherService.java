package com.arthur.kanban_api.service;

import com.arthur.kanban_api.event.KanbanEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Service de publication d'événements Redis pour la communication inter-microservices
 */
@Service
public class EventPublisherService {

    private static final Logger logger = LoggerFactory.getLogger(EventPublisherService.class);
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    // Préfixe pour tous les topics Kanban
    private static final String TOPIC_PREFIX = "kanban.";

    @Autowired
    public EventPublisherService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Publier un événement générique
     */
    public void publishEvent(String eventType, Map<String, Object> data) {
        publishEvent(eventType, data, null);
    }

    /**
     * Publier un événement avec métadonnées
     */
    public void publishEvent(String eventType, Map<String, Object> data, Map<String, Object> metadata) {
        try {
            KanbanEvent event = new KanbanEvent(eventType, data, metadata);
            String topic = TOPIC_PREFIX + eventType.toLowerCase();
            
            logger.info("Publishing event {} to topic {}", event.getEventId(), topic);
            logger.debug("Event details: {}", event);
            
            Long subscriberCount = redisTemplate.convertAndSend(topic, event);
            
            logger.info("Event {} published successfully to {} subscribers", 
                event.getEventId(), subscriberCount);
                
        } catch (Exception e) {
            logger.error("Failed to publish event type {}: {}", eventType, e.getMessage(), e);
            throw new RuntimeException("Event publication failed", e);
        }
    }

    /**
     * Publier un événement de création de carte
     */
    public void publishCardCreated(Long cardId, String title, Long listId, Long userId) {
        Map<String, Object> data = Map.of(
            "cardId", cardId,
            "title", title,
            "listId", listId,
            "userId", userId,
            "action", "created"
        );
        
        Map<String, Object> metadata = Map.of(
            "userId", userId,
            "correlationId", "card-" + cardId
        );
        
        publishEvent("CardCreated", data, metadata);
    }

    /**
     * Publier un événement de mise à jour de carte
     */
    public void publishCardUpdated(Long cardId, String title, Long listId, Long userId) {
        Map<String, Object> data = Map.of(
            "cardId", cardId,
            "title", title,
            "listId", listId,
            "userId", userId,
            "action", "updated"
        );
        
        Map<String, Object> metadata = Map.of(
            "userId", userId,
            "correlationId", "card-" + cardId
        );
        
        publishEvent("CardUpdated", data, metadata);
    }

    /**
     * Publier un événement de test pour vérifier la communication
     */
    public void publishTestEvent(String message, Long userId) {
        Map<String, Object> data = Map.of(
            "message", message,
            "timestamp", System.currentTimeMillis(),
            "test", true
        );
        
        Map<String, Object> metadata = Map.of(
            "userId", userId != null ? userId : 0L,
            "correlationId", "test-" + System.currentTimeMillis()
        );
        
        publishEvent("TestEvent", data, metadata);
    }
}
