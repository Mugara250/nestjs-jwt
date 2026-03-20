import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO } from './dto/signin.dto';
import { SignupDTO } from './dto/signup.dto';
import { User } from 'generated/prisma/browser';
import { AccessTokenGuard, RefreshTokenGuard } from './common/guards';
import { GetCurrentUser } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  public async signupLocal(@Body() signupDTO: SignupDTO) {
    return await this.authService.signupLocal(signupDTO);
  }

  @Post('local/signin')
  public async signinLocal(@Body() signinDTO: SigninDTO) {
    return await this.authService.signinLocal(signinDTO);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  public async refreshToken(
    @GetCurrentUser() user,
  ): Promise<{ id: number; access_token: string; refresh_token: string }> {
    return await this.authService.refreshTokens(
      user.sub,
      user.refresh_token_hash,
    );
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout(@GetCurrentUser('id') userId: number): Promise<void> {
    return await this.authService.logout(userId);
  }
}
