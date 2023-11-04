import { PartialType } from '@nestjs/swagger';
import { CreateRelationDto } from './create-relation.dto';

export class UpdateRelationDto extends PartialType(CreateRelationDto) {}
