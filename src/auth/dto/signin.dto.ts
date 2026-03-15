import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SigninDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  hash: string;
}
