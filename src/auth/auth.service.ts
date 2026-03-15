import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  public async signupLocal() {}
  public async signinLocal() {}
  public async logout() {}
  public async refreshTokens() {}
}
