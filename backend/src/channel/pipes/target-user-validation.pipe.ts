import { BadRequestException, PipeTransform } from "@nestjs/common";
import { length } from "class-validator";

export class TargetUserValidationPipe implements PipeTransform {
    transform(value: any) {
        if (!length(value, 4, 8)) {
            throw new BadRequestException(`사용자 닉네임은 4~8글자입니다. `);
        }
        
        return (value);
    }
}