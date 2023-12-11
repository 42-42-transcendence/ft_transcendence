import { BadRequestException, PipeTransform } from "@nestjs/common";
import { length } from "class-validator";

export class ChannelPasswordValidationPipe implements PipeTransform {
    transform(value: any) {
        if (!length(value, 0, 16)) {
            throw new BadRequestException(`채널 비밀번호의 길이는 0~16입니다.`);
        }

        return (value);
    }
}