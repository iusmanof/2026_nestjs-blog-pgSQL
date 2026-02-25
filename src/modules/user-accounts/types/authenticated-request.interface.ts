import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: { id: string; login: string; [key: string]: any };
  cookies: { refreshToken?: string; [key: string]: any };
}
