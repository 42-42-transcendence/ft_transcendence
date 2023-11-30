import { ArgumentsHost, Catch } from "@nestjs/common";
import { SocketException } from "./socket.exception";
import { BaseWsExceptionFilter } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Catch(SocketException)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToWs();
        const client: Socket = ctx.getClient();

        client.emit('tokenExpired', exception.message);
        console.log(exception);
    }
}
