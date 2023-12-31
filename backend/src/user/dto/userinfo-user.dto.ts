import { ApiProperty } from '@nestjs/swagger';
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
    example: 'http://localhost:3000/assets/profiles/550e8400-e29b-41d4-a716-446655440000.jpg', 
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
