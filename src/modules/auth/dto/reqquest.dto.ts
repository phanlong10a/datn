import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AppleLoginDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  accessToken?: string;

  @IsNotEmpty()
  @IsString()
  authorizationCode?: string;

  @IsNotEmpty()
  @IsString()
  type?: 'web' | 'ios' | 'android';
}

export class LoginInputDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @IsOptional()
  @IsString()
  fcm: string;
  @IsOptional()
  @IsBoolean()
  isLanding: boolean;
}
