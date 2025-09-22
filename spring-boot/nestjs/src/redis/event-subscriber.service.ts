import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Interface pour les événements Kanban
 */
export interface KanbanEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  source: string;
  version: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Service d'abonnement aux événements Redis depuis Spring Boot
 */
@Injectable()
export class EventSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(EventSubscriberService.name);

  constructor(private redisService: RedisService) {}

  /**
   * Initialisation des abonnements au démarrage
   */
  async onModuleInit() {
    this.logger.log('Initializing event subscriptions...');
    
    try {
      // S'abonner à tous les événements Kanban avec pattern
      await this.redisService.psubscribe(
        ['kanban.*'],
        this.handleKanbanEvent.bind(this)
      );
      
      this.logger.log('Event subscriptions initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize event subscriptions:', error);
    }
  }

  /**
   * Gestionnaire principal des événements Kanban
   */
  private handleKanbanEvent(pattern: string, channel: string, message: string) {
    try {
      const event: KanbanEvent = JSON.parse(message);
      
      this.logger.log(`Received event ${event.eventType} (${event.eventId}) from channel ${channel}`);
      this.logger.debug(`Event details:`, event);

      // Router les événements selon leur type
      switch (event.eventType) {
        case 'CardCreated':
          this.handleCardCreated(event);
          break;
        case 'CardUpdated':
          this.handleCardUpdated(event);
          break;
        case 'TestEvent':
          this.handleTestEvent(event);
          break;
        default:
          this.logger.warn(`Unknown event type: ${event.eventType}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process message from ${channel}:`, error);
      this.logger.error(`Raw message: ${message}`);
    }
  }

  /**
   * Traitement des événements de création de carte
   */
  private handleCardCreated(event: KanbanEvent) {
    this.logger.log(`Processing CardCreated event for card ${event.data.cardId}`);
    
    // Ici, on pourrait :
    // - Envoyer une notification WebSocket
    // - Mettre à jour un cache
    // - Déclencher d'autres actions
    
    this.logEventProcessing('CardCreated', event);
  }

  /**
   * Traitement des événements de mise à jour de carte
   */
  private handleCardUpdated(event: KanbanEvent) {
    this.logger.log(`Processing CardUpdated event for card ${event.data.cardId}`);
    
    this.logEventProcessing('CardUpdated', event);
  }

  /**
   * Traitement des événements de test
   */
  private handleTestEvent(event: KanbanEvent) {
    this.logger.log(`Processing TestEvent: ${event.data.message}`);
    
    // Afficher les détails pour le debug
    this.logger.log(`Test event received successfully!`);
    this.logger.log(`- Message: ${event.data.message}`);
    this.logger.log(`- Timestamp: ${new Date(event.data.timestamp)}`);
    this.logger.log(`- Source: ${event.source}`);
    this.logger.log(`- Event ID: ${event.eventId}`);
    
    this.logEventProcessing('TestEvent', event);
  }

  /**
   * Méthode utilitaire pour logger le traitement des événements
   */
  private logEventProcessing(eventType: string, event: KanbanEvent) {
    this.logger.log(`✅ Successfully processed ${eventType} event ${event.eventId}`);
    
    // Métadonnées utiles pour le monitoring
    if (event.metadata) {
      this.logger.debug(`Event metadata:`, event.metadata);
    }
  }

  /**
   * Publier un événement de réponse (si nécessaire)
   */
  async publishResponse(originalEvent: KanbanEvent, responseData: any) {
    const responseEvent = {
      eventId: `response-${Date.now()}`,
      eventType: `${originalEvent.eventType}Response`,
      timestamp: new Date().toISOString(),
      source: 'nestjs-api',
      version: '1.0',
      data: responseData,
      metadata: {
        originalEventId: originalEvent.eventId,
        correlationId: originalEvent.metadata?.correlationId,
      },
    };

    try {
      await this.redisService.publish(`kanban.responses.${responseEvent.eventType.toLowerCase()}`, responseEvent);
      this.logger.log(`Published response event ${responseEvent.eventId}`);
    } catch (error) {
      this.logger.error('Failed to publish response event:', error);
    }
  }

  /**
   * Obtenir les statistiques d'abonnement
   */
  getSubscriptionStats() {
    return {
      status: 'active',
      patterns: ['kanban.*'],
      connectionStatus: this.redisService.getConnectionStatus(),
    };
  }
}
