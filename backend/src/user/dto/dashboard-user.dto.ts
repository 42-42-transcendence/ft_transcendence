import { ApiProperty } from '@nestjs/swagger';
import { GameModeEnum } from 'src/game/enums/gameMode.enum';

export class DashboardUserDto {
  @ApiProperty({
    description: '상대 아이디',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    uniqueItems: true,
  })
  id: string;

  @ApiProperty({
    description: '상대 닉네임',
    example: 'vdoohkimv',
    type: 'string',
    uniqueItems: true,
  })
  nickname: string;

  @ApiProperty({
    description: '상대 프로필 이미지',
    example: 'http://localhost:3000/assets/profiles/550e8400-e29b-41d4-a716-446655440000.jpg',
  })
  image: string;

  @ApiProperty({ 
    description: '게임 모드',
    example: 'normal, object',
  })
  mode: GameModeEnum;

  @ApiProperty({ 
    description: '승패 여부',
    example: 'true, false',
  })
  isWin: boolean;

  @ApiProperty({ 
    description: '게임 타입 (랭크, 친선전)',
    example: 'ladder, friendly',
  })
  type: string;

  @ApiProperty({ 
    description: '스코어',
    example: '11:0',
  })
  score: string;
}
