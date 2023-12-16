import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth } from './entities/auth.entity';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // 유효한 토큰이면 해당 유저의 auth객체를 반환한다
  async validate(payload): Promise<Auth> {
    const { intraUID } = payload;
    const auth = await this.authService.checkAuthByIntraUIDWithHttpException(intraUID);

    return auth;
  }
}
