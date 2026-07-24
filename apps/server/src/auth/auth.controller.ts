import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 兼容 Ant Design Pro 默认登录路径 */
  @Post('login/account')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password, dto.type || 'account');
  }

  @Get('currentUser')
  @UseGuards(AuthGuard)
  currentUser(@Req() req: { user: any }) {
    return this.authService.currentUser(req.user);
  }

  @Post('login/outLogin')
  outLogin() {
    return { data: {}, success: true };
  }
}
