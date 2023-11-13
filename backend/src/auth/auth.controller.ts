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

  // 본래 token과 isSignUp이라는 boolean값을 반환해야함
  @Post()
  async userAuth(@Body('code') code: string): Promise<{ jwtToken: string; userName: string }> {
    const accessToken = await this.authService.createAuthToken(code);
    const { intraUID, intraName }= await this.authService.requestIntraUID(accessToken);
    const jwtToken = await this.authService.createJWT(intraUID);
    const userName = await this.authService.isSignup(intraUID, intraName);

    return { jwtToken, userName };
  }

  @Post('signup')
  @UseGuards(AuthGuard())
  async userSignUp(@Body() body) {
    console.log('--------------------- auth success ----------------------');
  }
}
