import { ConflictException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  public async signupLocal({ email, password }: SignupDTO) {
    try {
      const passwordHash = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          email: email,
          password_hash: passwordHash,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Credentials taken');
      }
      throw error;
    }
  }
  public async signinLocal() {}
  public async logout() {}
  public async refreshTokens() {}
}
