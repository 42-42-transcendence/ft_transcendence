import { Body, Controller, Delete, Post, Res, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { Response } from 'express';

@ApiTags('OTP')
@Controller('api/otp')
@UseGuards(AuthGuard())
export class OtpController {
  constructor(
    private otpService: OtpService,
    private userService: UserService,
  ) {}

  // 일단 저장해놨다가 클라쪽에서 취소를 하면 지우는 식으로 가기
  @Post()
  async registerOtp(
    @GetAuth() auth: Auth,
    @Res() res: Response,
  ) {
    const user = await auth.user;
    const secret = this.otpService.generateSecret();

    await this.userService.saveOtpAuthSecret(user, secret);

    const otpAuthUrl = this.otpService.createOtpAuthUtl(user);

    return (this.otpService.pipeQrCodeStream(res, otpAuthUrl));
  }

  @Post('validate')
  async validateOtpCode(
    @GetAuth() auth: Auth,
    @Body('code') code: string,
  ): Promise<{ isValidate: boolean }> {
    const user = await auth.user;
    const isValidate = this.otpService.validateOtpCode(code, user);
    
    return ({ isValidate });
  }

}
