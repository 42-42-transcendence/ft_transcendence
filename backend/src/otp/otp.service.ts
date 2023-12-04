import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OtpService {

	generateSecret(): string {
		return (authenticator.generateSecret());
	}

	createOtpAuthUtl(user: User): string {
		return (authenticator.keyuri(user.nickname, "otpauth://", user.otpAuthSecret));
	}
	
	validateOtpCode(code: string, user: User): boolean {
		return (authenticator.verify({
			token: code,
			secret: user.otpAuthSecret
		}));
	}

	async pipeQrCodeStream(res: Response, otpAuthUrl: string) {
		return (await toFileStream(res, otpAuthUrl));
	}
}
