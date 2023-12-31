import { ApiProperty } from '@nestjs/swagger';

export class UserAuthResponseDto {
  @ApiProperty({
    description: 'JWT 토큰',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    required: true,
  })
  jwtToken: string;

  @ApiProperty({
    description: '유저 가입 여부',
    example: 'True False',
    required: true,
    nullable: true,
  })
  isFirst: boolean;
}
