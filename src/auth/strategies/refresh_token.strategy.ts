import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  public async validate(request: Request, payload: Payload) {
    const refresh_token_hash = request
      .get('authorization')
      ?.replace('Bearer', '')
      .trim();
    return {
      ...payload,
      refresh_token_hash,
    };
  }
}
