import { BadRequestException, Body, Controller, Delete, Get, Post, Res, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { UserService } from 'src/user/user.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({
    summary: 'otp 활성화 되어 있는지 확인'
  })
  @ApiOkResponse({
    description: '성공',
    type: Boolean 
  })
  @Get()
  async getIsOtp(
    @GetAuth() auth: Auth,
  ): Promise<{ isActive: boolean }> {
    const user = await auth.user;
    if (!user) {
      return ({ isActive: false });
    }
    const isActive = user.isActiveOtp;

    return ({ isActive });
  }

  // 일단 저장해놨다가 클라쪽에서 취소를 하면 지우는 식으로 가기
  @ApiOperation({
    summary: 'otp 시크릿 저장하고 qrcode 반환'
  })
  @ApiOkResponse({
    description: '성공'
  })
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


  @ApiOperation({
    summary: 'otp가 제대로 등록이 되었는지 확인'
  })
  @ApiOkResponse({
    description: '성공',
    type: String 
  })
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


  @ApiOperation({
    summary: '로그인시 otp 인증 확인'
  })
  @ApiOkResponse({
    description: '성공',
    type: String 
  })
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


  @ApiOperation({
    summary: 'otp 인증 비활성화'
  })
  @ApiOkResponse({
    description: '성공',
    type: String
  })
  @Delete()
  async deactivateOtp(
    @GetAuth() auth: Auth
  ): Promise<{ message: string }>  {
    const user = await auth.user;

    await this.userService.removeOtpAuthSecret(user);
    return ({ message: `성공적으로 비활성화되었습니다.` });
  }

}
