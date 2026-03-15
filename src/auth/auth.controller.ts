import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO } from './dto/signin.dto';
import { SignupDTO } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  public signupLocal(@Body() signupDTO: SignupDTO) {
    return this.authService.signupLocal();
  }

  @Post('local/signin')
  public signinLocal(@Body() signinDTO: SigninDTO) {
    return this.authService.signinLocal();
  }

  @Post('refresh')
  public refreshToken() {
    this.authService.refreshTokens();
  }

  @Post('logout')
  public logout() {}
}
