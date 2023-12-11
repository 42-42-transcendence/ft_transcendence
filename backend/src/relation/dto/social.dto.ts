import { UserStatus } from "src/user/enums/user-status.enum";
import { RelationTypeEnum } from "../enums/relation-type.enum";

export class SocialDto {

    nickname: string;

    image: string;

    status: UserStatus;

    relation: RelationTypeEnum;
    
}