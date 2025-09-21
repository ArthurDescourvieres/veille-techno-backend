import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private notifications: any[] = [];

  findAll() {
    return {
      status: 'success',
      data: this.notifications,
      count: this.notifications.length,
    };
  }

  create(createNotificationDto: any) {
    const notification = {
      id: this.notifications.length + 1,
      ...createNotificationDto,
      createdAt: new Date().toISOString(),
    };
    
    this.notifications.push(notification);
    
    return {
      status: 'success',
      message: 'Notification created successfully',
      data: notification,
    };
  }
}
