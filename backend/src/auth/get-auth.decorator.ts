import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Auth } from "./entities/auth.entity";

export const GetAuth = createParamDecorator((data, ctx: ExecutionContext): Auth  => {
	const req = ctx.switchToHttp().getRequest();

	return (req.user)
})
