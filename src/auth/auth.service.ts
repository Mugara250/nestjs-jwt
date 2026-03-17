import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDTO, SignupDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  public async signupLocal({ email, password }: SignupDTO) {
    try {
      const passwordHash = await argon.hash(password);
      const user = this.prisma.user.create({
        data: {
          email: email,
          password_hash: password,
        },
      });
    } catch (error) {}
  }
  public async signinLocal(signinDTO: SigninDTO) {}
  public async logout() {}
  public async refreshTokens() {}
}
