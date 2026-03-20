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
import { AccessTokenGuard, RefreshTokenGuard } from './common/guards';
import { GetCurrentUser, Public } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  public async signupLocal(@Body() signupDTO: SignupDTO) {
    return await this.authService.signupLocal(signupDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  public async signinLocal(@Body() signinDTO: SigninDTO) {
    return await this.authService.signinLocal(signinDTO);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refreshToken(
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('refresh_token_hash') refresh_token_hash: string,
  ): Promise<{ id: number; access_token: string; refresh_token: string }> {
    return await this.authService.refreshTokens(userId, refresh_token_hash);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout(@GetCurrentUser('id') userId: number): Promise<void> {
    return await this.authService.logout(userId);
  }
}
