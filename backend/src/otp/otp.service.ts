import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class OtpService {

	generateSecret(): string {
		return (authenticator.generateSecret());
	}
}
