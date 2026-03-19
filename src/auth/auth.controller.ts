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
import { AuthGuard } from '@nestjs/passport';
import { User } from 'generated/prisma/browser';

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

  @Post('refresh')
  public async refreshToken() {
    this.authService.refreshTokens();
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout(@Req() request): Promise<void> {
    const user: User = request.user;
    return await this.authService.logout(user.id);
  }
}
