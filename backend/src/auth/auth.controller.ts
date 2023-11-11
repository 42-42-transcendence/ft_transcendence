import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async userAuth(@Body('code') code: string): Promise<{ jwtToken: string; isSignUp: boolean }> {
    const accessToken = await this.authService.createAuthToken(code);
    console.log('1', accessToken);
    const intraUID = await this.authService.requestIntraUID(accessToken);
    console.log('2', intraUID);
    const jwtToken = await this.authService.createJWT(intraUID);
    console.log('3', jwtToken);
    const isSignUp = await this.authService.isSignUp(intraUID);

    return { jwtToken, isSignUp };
  }

  @Post('signup')
  @UseGuards(AuthGuard())
  async userSignUp(@Body() body) {
    console.log('--------------------- auth success ----------------------');
  }
}
