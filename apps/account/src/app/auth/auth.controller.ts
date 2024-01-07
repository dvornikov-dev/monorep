import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-ip.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    const token = await this.authService.signIn(dto.email, dto.password);
    return { token };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: { id: string; email: string; role: string }) {
    return this.authService.getMe(user.id);
  }
}
