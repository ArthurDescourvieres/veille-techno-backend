import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Post()
  create(@Body() createNotificationDto: any) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('test')
  test() {
    return {
      message: 'NestJS Notifications API is working!',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/v1/notifications',
        'POST /api/v1/notifications',
        'GET /api/v1/notifications/test',
      ],
    };
  }
}
