import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Service Redis pour la gestion des connexions et opérations de base
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private configService: ConfigService) {
    this.initializeRedisConnections();
  }

  /**
   * Initialise les connexions Redis (publisher et subscriber séparées)
   */
  private initializeRedisConnections() {
    const redisConfig = {
      host: this.configService.get('REDIS_HOST', 'redis'),
      port: this.configService.get('REDIS_PORT', 6379),
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    };

    this.logger.log(`Connecting to Redis at ${redisConfig.host}:${redisConfig.port}`);

    // Connexion pour la publication
    this.publisher = new Redis(redisConfig);
    
    // Connexion pour l'abonnement (séparée pour éviter les conflits)
    this.subscriber = new Redis(redisConfig);

    // Gestion des événements de connexion
    this.publisher.on('connect', () => {
      this.logger.log('Publisher connected to Redis');
    });

    this.subscriber.on('connect', () => {
      this.logger.log('Subscriber connected to Redis');
    });

    this.publisher.on('error', (err) => {
      this.logger.error('Publisher Redis connection error:', err);
    });

    this.subscriber.on('error', (err) => {
      this.logger.error('Subscriber Redis connection error:', err);
    });

    this.publisher.on('ready', () => {
      this.logger.log('Publisher Redis connection ready');
    });

    this.subscriber.on('ready', () => {
      this.logger.log('Subscriber Redis connection ready');
    });
  }

  /**
   * Publier un message sur un topic
   */
  async publish(topic: string, message: any): Promise<number> {
    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      const result = await this.publisher.publish(topic, messageStr);
      this.logger.log(`Published message to topic '${topic}': ${result} subscribers`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to publish to topic '${topic}':`, error);
      throw error;
    }
  }

  /**
   * S'abonner à un ou plusieurs topics
   */
  async subscribe(topics: string[], callback: (channel: string, message: string) => void): Promise<void> {
    try {
      await this.subscriber.subscribe(...topics);
      this.logger.log(`Subscribed to topics: ${topics.join(', ')}`);

      this.subscriber.on('message', (channel, message) => {
        this.logger.debug(`Received message from ${channel}: ${message}`);
        callback(channel, message);
      });
    } catch (error) {
      this.logger.error(`Failed to subscribe to topics ${topics.join(', ')}:`, error);
      throw error;
    }
  }

  /**
   * S'abonner à des patterns de topics
   */
  async psubscribe(patterns: string[], callback: (pattern: string, channel: string, message: string) => void): Promise<void> {
    try {
      await this.subscriber.psubscribe(...patterns);
      this.logger.log(`Subscribed to patterns: ${patterns.join(', ')}`);

      this.subscriber.on('pmessage', (pattern, channel, message) => {
        this.logger.debug(`Received message from ${channel} (pattern ${pattern}): ${message}`);
        callback(pattern, channel, message);
      });
    } catch (error) {
      this.logger.error(`Failed to subscribe to patterns ${patterns.join(', ')}:`, error);
      throw error;
    }
  }

  /**
   * Se désabonner de topics
   */
  async unsubscribe(topics?: string[]): Promise<void> {
    try {
      if (topics) {
        await this.subscriber.unsubscribe(...topics);
        this.logger.log(`Unsubscribed from topics: ${topics.join(', ')}`);
      } else {
        await this.subscriber.unsubscribe();
        this.logger.log('Unsubscribed from all topics');
      }
    } catch (error) {
      this.logger.error('Failed to unsubscribe:', error);
      throw error;
    }
  }

  /**
   * Obtenir le statut de la connexion Redis
   */
  getConnectionStatus() {
    return {
      publisher: this.publisher.status,
      subscriber: this.subscriber.status,
    };
  }

  /**
   * Nettoyage lors de la destruction du module
   */
  async onModuleDestroy() {
    this.logger.log('Closing Redis connections...');
    
    try {
      await this.subscriber.disconnect();
      await this.publisher.disconnect();
      this.logger.log('Redis connections closed');
    } catch (error) {
      this.logger.error('Error closing Redis connections:', error);
    }
  }
}
