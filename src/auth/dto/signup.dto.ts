import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  hash: string;
}
