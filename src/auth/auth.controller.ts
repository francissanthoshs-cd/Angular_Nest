import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/DTO/registerUser.dto';
import { UserLoginDto } from 'src/DTO/userLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registration(@Body(ValidationPipe) regDTO: RegisterUserDto) {
    return this.authService.registerUser(regDTO);
  }

  @Post('login')
  sigIn(@Body(ValidationPipe) loginDto: UserLoginDto) {
    return this.authService.loginUser(loginDto);
  }
}
