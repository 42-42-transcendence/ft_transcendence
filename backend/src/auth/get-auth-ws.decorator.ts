import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Auth } from "./entities/auth.entity";

export const GetAuthWs = createParamDecorator((data, ctx: ExecutionContext): Auth  => {
	const req = ctx.switchToWs().getClient();

	return (req.user)
})
