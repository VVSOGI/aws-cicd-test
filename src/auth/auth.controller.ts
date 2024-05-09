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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    // console.log(code, 213);
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:4000/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const { id_token, access_token } = await response.json();

    const getProfiles = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
    );
    const profile = await getProfiles.json();
    try {
      await this.authService.createGoogleUser(profile);
      res.cookie('accessToken', id_token, {
        httpOnly: true,
      });
      res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
      Logger.error(
        `[AuthController] Error in googleAuthRedirect: ${error.message}`,
      );
      // res.redirect(process.env.FRONTEND_URL);
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
