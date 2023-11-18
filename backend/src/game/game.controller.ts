import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Game } from './entities/game.entity';
import { GameInfoDto } from './dto/in-game.dto';

@ApiTags('GAME')
@Controller('api/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: '게임 조회' })
  @ApiOkResponse({ description: '조회 성공', type: [Game]})
  @Get()
  async getFinishedGames() : Promise<Game[]> {
      return await this.gameService.getFinishedGames();
  }

  @ApiOperation({ summary: '전체 게임 조회' })
  @ApiOkResponse({ description: '조희 성공' , type: Game})
  @Get('all')
  async getAll() : Promise<Game[]> {
    return this.gameService.findAllGame();
}

  @ApiOperation({ summary: '특정 게임 조회' })
  @ApiParam({ name: 'id', required: true, description: '게임 ID' })
  @ApiOkResponse({ description: 'ID로 조회 성공' , type: Game})
  @Get(':id')
  async getById(@Param('id') id : string) : Promise<Game> {
    return this.gameService.findGameById(id);
}

  // @ApiOperation({ summary: '게임 참가' })
  // @ApiOkResponse({ description: '참가 성공' , type: [Game]})
  // @Get('join')
  // gamesToJoin() : GameInfoDto[] {
  //     return this.gameService.getGamesToJoin();
  // }
}
