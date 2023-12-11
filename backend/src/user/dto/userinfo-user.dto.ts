import { ApiProperty } from '@nestjs/swagger';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';
import { UserStatus } from '../enums/user-status.enum';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';

export class UserinfoUserDto {
  @ApiProperty({
    description: '닉네임',
    example: 'vdoohkimv',
    type: 'string',
    uniqueItems: true,
  })
  nickname: string;
  @ApiProperty({
    description: '프로필 이미지',
    example: './User/byeonkim/images/kobe.jpg',
    required: true,
  })
  image: string;
  @ApiProperty({
    description: '유저 상태',
    example: 'online, offline, playing',
  })
  status: UserStatus;
  @ApiProperty({
    description: '유저 관계',
    example: 'unknown, friend, block',
  })
  relation: RelationTypeEnum;
}
