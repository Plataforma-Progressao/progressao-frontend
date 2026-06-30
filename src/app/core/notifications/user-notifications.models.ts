export type UserNotificationTone = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface UserNotification {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly message: string;
  readonly icon: string | null;
  readonly tone: UserNotificationTone;
  readonly kind: string | null;
  readonly isRead: boolean;
  readonly readAt: string | null;
  readonly createdAt: string;
}

export interface ListUserNotificationsQuery {
  readonly page?: number;
  readonly pageSize?: number;
  readonly unreadOnly?: boolean;
}

export interface PaginatedUserNotificationsResponse {
  readonly items: readonly UserNotification[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}
