import { BadRequestException, Body, Controller, Delete, Get, Post, Res, UseGuards } from '@nestjs/common';
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


  @Get()
  async getIsOtp(
    @GetAuth() auth: Auth,
  ): Promise<{ isActive: boolean }> {
    const user = await auth.user;
    const isActive = user.isActiveOtp;

    return ({ isActive });
  }

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
    @Body('otp') otpCode: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const isValidate = this.otpService.validateOtpCode(otpCode, user);

    if (!isValidate) {
      throw new BadRequestException(`현재 맞는 code가 아닙니다.`);
    }

    await this.userService.turnOnOtp(user);
    
    return ({ message: `성공적으로 otp가 활성화되었습니다.` });
  }


  @Post('login')
  async loginOtpCode(
    @GetAuth() auth: Auth,
    @Body('otp') otpCode: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const isValidate = this.otpService.validateOtpCode(otpCode, user);

    if (!isValidate) {
      throw new BadRequestException(`현재 맞는 code가 아닙니다.`);
    }
    
    return ({ message: `성공적으로 인증되었습니다.` });
  }


  @Delete()
  async deactivateOtp(
    @GetAuth() auth: Auth
  ) {
    const user = await auth.user;

    await this.userService.removeOtpAuthSecret(user);
  }

}
