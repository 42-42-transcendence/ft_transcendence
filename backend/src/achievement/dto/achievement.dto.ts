import { ApiProperty } from '@nestjs/swagger';

export class AchievementDto {
  @ApiProperty({
    description: '도전과제 번호',
    example: '1',
    type: 'number',
    uniqueItems: true,
  })
  id: number;

  @ApiProperty({
    description: '도전과제 이름',
    example: 'First Victory!',
    type: 'string',
    uniqueItems: true,
  })
  name: string;

  @ApiProperty({
    description: '도전과제 설명',
    example: 'First Blood!',
    uniqueItems: true,
  })
  description: string;
}
