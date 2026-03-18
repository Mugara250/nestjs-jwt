import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO } from './dto/signin.dto';
import { SignupDTO } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  public async signupLocal(@Body() signupDTO: SignupDTO) {
    return await this.authService.signupLocal(signupDTO);
  }

  @Post('local/signin')
  public signinLocal(@Body() signinDTO: SigninDTO) {
    return this.authService.signinLocal(signinDTO);
  }

  @Post('refresh')
  public refreshToken() {
    this.authService.refreshTokens();
  }

  @Post('logout')
  public logout() {}
}
