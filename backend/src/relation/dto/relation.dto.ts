import { User } from "src/user/entities/user.entity";
import { RelationTypeEnum } from "../enums/relation-type.enum";

export class RelationDto {

	subjectUser: User;

	objectUser: User;

	relationType: RelationTypeEnum;

}
