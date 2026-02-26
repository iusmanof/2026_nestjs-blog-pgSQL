import { SessionEntity } from '../../domain/session.entity';

export class DeviceViewDto {
  deviceId: string;
  title: string;
  ip: string;
  lastActiveDate: Date;

  static mapToView(session: SessionEntity): DeviceViewDto {
    return {
      deviceId: session.deviceId,
      title: session.title,
      ip: session.ip,
      lastActiveDate: session.lastActiveDate,
    };
  }

  static mapToViews(sessions: SessionEntity[]): DeviceViewDto[] {
    return sessions.map((s) => this.mapToView(s));
  }
}
