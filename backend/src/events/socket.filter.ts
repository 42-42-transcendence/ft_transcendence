import { ArgumentsHost, Catch } from "@nestjs/common";
import { SocketException } from "./socket.exception";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch(SocketException)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        // super.catch(exception, host);
        console.log('---------------------------hahahah', exception);
        const ackCallback = host.getArgByIndex(2);
        ackCallback(exception);
    }
}