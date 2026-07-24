import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface AuthUser {
  name: string;
  userid: string;
  access: 'admin' | 'user';
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  private getFixedUsers(): Array<{
    username: string;
    password: string;
    user: AuthUser;
  }> {
    const adminUser =
      this.config.get<string>('AUTH_USERNAME') || 'admin';
    const adminPass =
      this.config.get<string>('AUTH_PASSWORD') || 'admin123';
    const userUser =
      this.config.get<string>('AUTH_USER_USERNAME') || 'user';
    const userPass =
      this.config.get<string>('AUTH_USER_PASSWORD') || 'user123';

    return [
      {
        username: adminUser,
        password: adminPass,
        user: {
          name: '管理员',
          userid: '00000001',
          access: 'admin',
        },
      },
      {
        username: userUser,
        password: userPass,
        user: {
          name: '普通用户',
          userid: '00000002',
          access: 'user',
        },
      },
    ];
  }

  login(username: string, password: string, type = 'account') {
    const found = this.getFixedUsers().find(
      (u) => u.username === username && u.password === password,
    );

    if (!found) {
      return {
        status: 'error',
        type,
        currentAuthority: 'guest',
        errorMessage: '用户名或密码错误',
      };
    }

    const token = this.jwt.sign({
      sub: found.user.userid,
      username,
      access: found.user.access,
      name: found.user.name,
    });

    return {
      status: 'ok',
      type,
      currentAuthority: found.user.access,
      token,
    };
  }

  currentUser(payload: {
    sub: string;
    username: string;
    access: 'admin' | 'user';
    name: string;
  }): { success: true; data: AuthUser } {
    return {
      success: true,
      data: {
        name: payload.name,
        userid: payload.sub,
        access: payload.access,
      },
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwt.verify(token) as {
        sub: string;
        username: string;
        access: 'admin' | 'user';
        name: string;
      };
    } catch {
      throw new UnauthorizedException('登录已失效，请重新登录');
    }
  }
}
