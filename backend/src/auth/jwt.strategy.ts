import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthRepository } from "./auth.repository";
import { Auth } from "./entities/auth.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authRepository: AuthRepository
	) {
		super({
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}

	// 유효한 토큰이면 해당 유저의 auth객체를 반환한다
	async validate(payload): Promise<Auth> {
		const { intraUID } = payload;
		const auth = await this.authRepository.findOneBy({ intraUID });

		if (!auth) {
			throw new UnauthorizedException(`token이 유효하지 않습니다.`);
		}

		return (auth);
	}

}
