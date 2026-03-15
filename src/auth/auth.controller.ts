import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  public signupLocal() {
    return this.authService.signupLocal();
  }

  @Post('local/signin')
  public signinLocal(@Body() authData: AuthDTO) {
    return this.authService.signinLocal();
  }

  @Post('refresh')
  public refreshToken() {
    this.authService.refreshTokens();
  }

  @Post('logout')
  public logout() {}
}
