import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { IsNull } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
		private authRepository: AuthRepository,
		private jwtService: JwtService
	) {}

	async createAuthToken(code: string): Promise<string> {
		const clientID = process.env.AUTH_ID;
		const clientSecret = process.env.AUTH_SECRET;
		const grantType = 'authorization_code';
		const redirectUri = 'http://localhost:3000/api/user/oauth';

		const authUrl = 'https://api.intra.42.fr/oauth/token';
		const data = { code, grantType, clientID, clientSecret, redirectUri };

		try {
			const response = await axios.post(authUrl, data);
			if (response.status === HttpStatus.OK) {
				return (response.data.access_token);
			}
		} catch (e) {
			console.log('asdf', e);
		}
	}

	async requestIntraUID(accessToken: string): Promise<string> {
		const url = 'https://api.intra.42.fr/v2/me'

		try {
			const res = await axios.get(url, {
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			});
			if (res.status === HttpStatus.OK)
				return (res.data.id);
		} catch (e) {
			console.log('asdf', e);
		}
	}

	async isSignUp(intraUID: string): Promise<boolean> {
		const auth = await this.authRepository.getAuthByIntraID(intraUID);

		if (!auth) {
			this.authRepository.createAuth(intraUID);
			return (false);
		}
		return (true);
	}

	async createJWT(intraUID: string): Promise<string> {
		const payload = { intraUID };
		const jwtToken = await this.jwtService.sign(payload);

		return (jwtToken);
	}

}
