import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = (req.headers.authorization ||
      req.headers.Authorization ||
      '') as string;
    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : header || (req.headers['x-access-token'] as string) || '';

    if (!token) {
      throw new UnauthorizedException('未登录');
    }

    req.user = this.authService.verifyToken(token);
    return true;
  }
}
