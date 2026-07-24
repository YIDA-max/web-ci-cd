import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  /** Ant Design Pro 登录类型，固定 account */
  @IsString()
  type?: string;
}
