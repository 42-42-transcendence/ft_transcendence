import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { length } from "class-validator";

export class OtpCodeValidationPipe implements PipeTransform {
    transform(value: any) {
        if (!length(value, 6, 6)) {
            throw new BadRequestException(`OTP Code의 길이는 6글자 입니다.`);
        }

        return (value);
    }
}