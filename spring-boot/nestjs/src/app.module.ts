import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env', // Fichier .env au niveau spring-boot
    }),
    
    // Base de données PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5433,
      username: process.env.DB_USERNAME || 'kanban',
      password: process.env.DB_PASSWORD || 'kanban',
      database: process.env.DB_NAME || 'kanban',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Attention en prod
      logging: process.env.NODE_ENV === 'development',
    }),
    
    // Modules de l'application
    TerminusModule,
    HealthModule,
    NotificationsModule,
    RedisModule,
  ],
})
export class AppModule {}
