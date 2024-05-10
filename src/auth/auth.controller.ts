import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  BadRequestException,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req) {
    const requestUserId = req.user.id;
    return this.authService.profile(requestUserId);
  }

  @Get('google')
  async googleAuth() {
    const googleLoginUrl = await this.authService.getGoogleLoginUrl();
    return { url: googleLoginUrl };
  }

  @Get('google/callback')
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { code } = req.query;
    try {
      const token = await this.authService.getGoogleToken(code);
      const { id_token, access_token } = token;
      const profile = await this.authService.getGoogleProfile(access_token);
      await this.usersService.createGoogleUser(profile);

      res.cookie('accessToken', id_token, { httpOnly: true });
      res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
      Logger.error(
        `[AuthController] Error in googleAuthRedirect: ${error.message}`,
      );
      res.redirect(process.env.FRONTEND_URL);
    }
  }

  @Get('refresh/:id')
  @UseGuards(JwtAuthGuard)
  async refresh(@Request() req, @Param('id') id: string) {
    if (req.user.id !== id) {
      Logger.error(
        '[AuthController] Not matched user id in refresh token controller',
      );
      throw new BadRequestException('Invalid user');
    }
    return this.authService.refresh(id);
  }
}
