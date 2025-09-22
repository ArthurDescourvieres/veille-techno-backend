import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EventSubscriberService } from './event-subscriber.service';
import { RedisController } from './redis.controller';

/**
 * Module Redis global pour la communication inter-microservices
 */
@Global()
@Module({
  controllers: [RedisController],
  providers: [RedisService, EventSubscriberService],
  exports: [RedisService, EventSubscriberService],
})
export class RedisModule {}
