import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuthResponseDto } from './dto/user-auth-response.dto';
import { GetAuth } from './get-auth.decorator';
import { Auth } from './entities/auth.entity';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'JWT 토큰 발급 및 회원가입 유무 파악',
  })
  @ApiOkResponse({
    description: '성공',
    type: UserAuthResponseDto,
  })
  @Post()
  async userAuth(@Body('code') code: string): Promise<UserAuthResponseDto> {
    const accessToken = await this.authService.createAuthToken(code);
    const { intraUID } = await this.authService.requestIntraUID(accessToken);
    const jwtToken = await this.authService.createJWT(intraUID);
    const isFirst = await this.authService.isSignup(intraUID);

    return { jwtToken, isFirst };
  }

  @ApiOperation({
    summary: '회원가입',
  })
  @Post('signup')
  @UseGuards(AuthGuard())
  async userSignUp(@Body() body) {
    console.log('--------------------- auth success ----------------------');
  }


  @ApiOperation({
    summary: '토큰이 유효한지 확인한다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Get()
  @UseGuards(AuthGuard())
  async checkTokenIsValidated(): Promise<{ message: string }> {
    return ({ message: '유효한 토큰입니다.'});
  }

  @Get('nickname')
  @UseGuards(AuthGuard())
  async getUserNicknameByToken(
    @GetAuth() auth: Auth
  ): Promise<{ nickname: string }> {
    const user = await this.authService.getUserByAuthWithHttpException(auth);
    return ({ nickname: user.nickname });
  }
}
