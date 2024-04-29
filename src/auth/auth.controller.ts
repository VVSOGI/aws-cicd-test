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
