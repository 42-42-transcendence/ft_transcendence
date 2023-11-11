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
    private jwtService: JwtService,
  ) {}

  async createAuthToken(code: string): Promise<string> {
    const client_id = process.env.AUTH_ID;
    const client_secret = process.env.AUTH_SECRET;
    const grant_type = 'authorization_code';
    const redirect_uri = 'http://localhost:3000/login/oauth';

    const authUrl = 'https://api.intra.42.fr/oauth/token';
    const data = { code, grant_type, client_id, client_secret, redirect_uri };

    try {
      const response = await axios.post(authUrl, data);
      if (response.status === HttpStatus.OK) {
        return response.data.access_token;
      }
    } catch (e) {
      console.log('aaaaaaaa', e);
    }
  }

  async requestIntraUID(accessToken: string): Promise<string> {
    const url = 'https://api.intra.42.fr/v2/me';

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status === HttpStatus.OK) return res.data.id;
    } catch (e) {
      console.log('bbbbbbbb', e);
    }
  }

  async isSignUp(intraUID: string): Promise<boolean> {
    const auth = await this.authRepository.getAuthByIntraID(intraUID);

    if (!auth) {
      this.authRepository.createAuth(intraUID);
      return false;
    }
    return true;
  }

  async createJWT(intraUID: string): Promise<string> {
    const payload = { intraUID };
    const jwtToken = await this.jwtService.sign(payload);

    return jwtToken;
  }
}
