import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Auth } from "./entities/auth.entity";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

// export const GetAuthWs = createParamDecorator((data, ctx: ExecutionContext): Auth  => {
// 	const jwtService: JwtService = new JwtService();
// 	const authService: AuthService = new AuthService();
// 	const client: Socket = ctx.switchToWs().getClient();
// 	const token = client.handshake.auth.token;
// 	const decode = jwtService.verify(token);
// 	const auth = authService.getAuthByIntraID(decode.intraUID);

// 	return (auth);
// })
