import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthRepository } from "./auth.repository";

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

	async validate(payload) {
		const { intraUID } = payload;
		const authUser = await this.authRepository.findOneBy({ intraUID });

		if (!authUser) {
			throw new UnauthorizedException(`token이 유효하지 않습니다.`);
		}

		return (authUser);
	}

}
