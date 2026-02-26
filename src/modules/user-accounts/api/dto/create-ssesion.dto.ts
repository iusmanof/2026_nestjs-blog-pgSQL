export interface CreateSessionDto {
  userId: string;
  deviceId: string;
  ip: string;
  title: string;
  refreshTokenHash: string;
  lastActiveDate: Date;
  expiresAt: Date;
}
