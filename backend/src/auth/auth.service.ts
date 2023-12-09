import { HttpStatus, Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserRepository } from 'src/user/user.repository';
import { Auth } from './entities/auth.entity';
import { SocketException } from 'src/events/socket.exception';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createAuthToken(code: string): Promise<string> {
    const client_id = process.env.AUTH_ID;
    const client_secret = process.env.AUTH_SECRET;
    const grant_type = 'authorization_code';
    const redirect_uri = 'http://localhost:3000/oauth';

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

  async requestIntraUID(accessToken: string): Promise<{ intraUID: string }> {
    const url = 'https://api.intra.42.fr/v2/me';

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === HttpStatus.OK) {
        const intraUID = res.data.id;
        return { intraUID };
      }
    } catch (e) {
      console.log('bbbbbbbb', e);
    }
  }

  // 본래 회원가입 되어있는지 아닌지(user 객체가 있는지 없는지)를 확인하여 boolean값을 반환하는 메소드
  // 현재는 임시 테스트로 username을 반환하게 했음
  async isSignup(intraUID: string): Promise<boolean> {
    const auth = await this.authRepository.getAuthByIntraID(intraUID);

    if (!auth) {
      const newAuth = await this.authRepository.createAuth(intraUID);
      return true;
    } else {
      const user = await auth.user;
      if (user) return false;
      else return true;
    }
    return false;
  }

  async createJWT(intraUID: string): Promise<string> {
    const payload = { intraUID };
    const jwtToken = await this.jwtService.sign(payload);

    return jwtToken;
  }

  async checkAuthByIntraUIDWithHttpException(intraUID: string): Promise<Auth> {
    const auth = await this.authRepository.getAuthByIntraID(intraUID);

    if (!auth) {
      throw new UnauthorizedException(`토큰이 유효하지 않습니다.`);
    }

    return auth;
  }

  async checkAuthByIntraUIDWithWsException(intraUID: string): Promise<Auth> {
    const auth = await this.authRepository.getAuthByIntraID(intraUID);

    if (!auth) {
      throw new SocketException('Unauthorized', `토큰이 유효하지 않습니다.`);
    }

    return auth;
  }

  async checkAuthByJWT(token: string): Promise<Auth> {
    try {
      const decode = this.jwtService.verify(token);
      const auth = await this.checkAuthByIntraUIDWithWsException(decode.intraUID);

      return auth;
    } catch (e) {
      throw new SocketException('Unauthorized', `토큰이 유효하지 않습니다.`);
    }
  }

  async getUserByAuthWithWsException(auth: Auth): Promise<User> {
    const user = await auth.user;

    if (!user) {
      throw new SocketException('NotFound', `해당 토큰의 유저를 찾을수 없습니다.`);
    }
    return user;
  }
  async getUserByAuthWithHttpException(auth: Auth): Promise<User> {
    const user = await auth.user;

    if (!user) {
      throw new NotFoundException(`해당 토큰의 유저를 찾을수 없습니다.`);
    }
    return user;
  }
}
