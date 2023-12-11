import { BadRequestException, PipeTransform } from "@nestjs/common";
import { isBoolean } from "class-validator";

export class BooleanValidationPipe implements PipeTransform {
    transform(value: any) {
        if (!isBoolean(value)) {
            throw new BadRequestException(`boolean값이 아닙니다.`)
        }
    }
}