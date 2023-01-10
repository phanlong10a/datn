import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
