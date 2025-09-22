import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EventSubscriberService } from './event-subscriber.service';

/**
 * Contrôleur pour tester et monitorer Redis
 */
@Controller('redis')
export class RedisController {
  private readonly logger = new Logger(RedisController.name);

  constructor(
    private redisService: RedisService,
    private eventSubscriber: EventSubscriberService,
  ) {}

  /**
   * Obtenir le statut de Redis
   */
  @Get('status')
  getRedisStatus() {
    try {
      const connectionStatus = this.redisService.getConnectionStatus();
      const subscriptionStats = this.eventSubscriber.getSubscriptionStats();

      return {
        success: true,
        service: 'nestjs-api',
        redis: {
          connections: connectionStatus,
          subscriptions: subscriptionStats,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get Redis status:', error);
      return {
        success: false,
        message: 'Failed to get Redis status',
        error: error.message,
      };
    }
  }

  /**
   * Publier un message de test depuis NestJS vers Spring Boot
   */
  @Post('publish-test')
  async publishTestMessage(@Body() body: { message?: string; userId?: number }) {
    try {
      const { message = 'Hello from NestJS!', userId = null } = body;

      const testEvent = {
        eventId: `nestjs-test-${Date.now()}`,
        eventType: 'NestJSTestEvent',
        timestamp: new Date().toISOString(),
        source: 'nestjs-api',
        version: '1.0',
        data: {
          message,
          timestamp: Date.now(),
          test: true,
        },
        metadata: {
          userId: userId || 0,
          correlationId: `nestjs-test-${Date.now()}`,
        },
      };

      const subscriberCount = await this.redisService.publish('kanban.nestjstestevent', testEvent);

      this.logger.log(`Published test event to ${subscriberCount} subscribers`);

      return {
        success: true,
        message: 'Test event published successfully',
        data: {
          eventId: testEvent.eventId,
          subscriberCount,
          testMessage: message,
        },
      };
    } catch (error) {
      this.logger.error('Failed to publish test message:', error);
      return {
        success: false,
        message: 'Failed to publish test message',
        error: error.message,
      };
    }
  }

  /**
   * Obtenir les statistiques d'événements (pour monitoring)
   */
  @Get('stats')
  getEventStats() {
    return {
      success: true,
      service: 'nestjs-api',
      stats: {
        uptime: process.uptime(),
        subscriptions: this.eventSubscriber.getSubscriptionStats(),
        redis: this.redisService.getConnectionStatus(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
