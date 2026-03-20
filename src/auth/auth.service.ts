import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDTO, SignupDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
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

  public async signinLocal({ email, password }: SigninDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      console.log(user);
      throw new ForbiddenException('Authentication failed!');
    }
    const hashCheck = await argon.verify(user.password_hash, password);
    if (!hashCheck) {
      console.log(hashCheck);
      throw new ForbiddenException('Authentication failed!');
    }
    const payload: Payload = {
      sub: user.id,
      email: user.email,
    };
    return await this.getTokens(payload);
  }

  public async logout(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
        refresh_token_hash: {
          not: null,
        },
      },
      data: {
        refresh_token_hash: null,
      },
    });
  }

  public async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access denied');

    if (user.refresh_token_hash) {
      console.log(user.refresh_token_hash, refreshToken);
      const refreshTokensMatch = await argon.verify(
        user.refresh_token_hash,
        refreshToken,
      );
      if (!refreshTokensMatch) throw new ForbiddenException('Access denied');
      const tokens = await this.getTokens({ sub: userId, email: user.email });
      console.log(tokens);
      return tokens;
    }
    throw new ForbiddenException('Access denied');
  }

  async getTokens(
    payload: Payload,
  ): Promise<{ id: number; access_token: string; refresh_token: string }> {
    const getAccessToken = async () =>
      await this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      });
    const getRefreshToken = async () =>
      await this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      });
    const [access_token, refresh_token] = await Promise.all([
      getAccessToken(),
      getRefreshToken(),
    ]);

    if (refresh_token) {
      const refreshTokenHash = await argon.hash(refresh_token);
      await this.prisma.user.update({
        where: {
          id: payload.sub,
        },
        data: {
          refresh_token_hash: refreshTokenHash,
        },
      });
    }
    return {
      id: payload.sub,
      access_token,
      refresh_token,
    };
  }
}
