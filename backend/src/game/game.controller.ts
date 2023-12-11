import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Game } from './entities/game.entity';
// import { GameInfoDto } from './dto/in-game.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { UserService } from 'src/user/user.service';
import { EventsGateway } from 'src/events/events.gateway';
import { NotiType } from 'src/notification/enums/noti-type.enum';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { NotificationService } from 'src/notification/notification.service';
import { GameModeEnum } from './enums/gameMode.enum';
import { GameTypeEnum } from './enums/gameType.enum';

@ApiTags('GAME')
@Controller('api/game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private userService: UserService,
    private eventsGateway: EventsGateway,
    private notificationService: NotificationService,
  ) {}

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

  @ApiOperation({ summary: 'gameId로 게임 조회' })
  @ApiParam({ name: 'gameId', required: true, description: '게임 ID' })
  @ApiOkResponse({ description: 'ID로 조회 성공' , type: Game})
  @Get(':gameId')
  async getById(@Param('gameId') id : string) : Promise<Game> {
    return this.gameService.findGameById(id);
}

  @ApiOperation({ summary: '특정 상대를 게임에 초대한다' })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post('invite')
  @UseGuards(AuthGuard())
  async inviteGameToUser(
    @GetAuth() auth: Auth,
    @Body('targetUserID') targetUser: string
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const invitedUser = await this.userService.getUserByNicknameWithException(targetUser);

    // 요청을 보낼때, 이미 보낸 요청이 있는지 검사할 것. 단 에러는 던지지 않는다
    if (await this.notificationService.isSendGameNotiToInvitedUser(invitedUser, user.nickname)) {
      return ({ message: `${invitedUser.nickname}님에게 이미 게임초대를 보냈습니다.` });
    }

    await this.eventsGateway.sendInviteGameNotification(
      `${user.nickname}님이 ${invitedUser.nickname}님에게 게임초대를 보냈습니다.`,
      NotiType.GAME,
      invitedUser,
      user.nickname
    );

    return ({ message: `${invitedUser.nickname}님에게 성공적으로 게임초대를 보냈습니다.` });
  }

  @ApiOperation({ summary: '게임 초대를 수락한다' })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post('accept')
  @UseGuards(AuthGuard())
  async acceptInviteGame(
    @GetAuth() auth: Auth,
    @Body('targetUserID') targetUser: string
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const sendUser = await this.userService.getUserByNicknameWithException(targetUser);
    // user가 초대를 받은 유저가 맞는지 확인이 필요함
    // 확인이 안되면, postman등으로 초대를 받지 않는 C가 A에게 일방적으로 수락 req를 보낼 수도 있음.
    const noti = await this.notificationService
          .getGameNotiByInvitedUserAndSendUserNicknameWithException(user, sendUser.nickname);

    await this.notificationService.deleteNotification(noti.notiID);

    if (user.status !== UserStatus.ONLINE) {
      throw new BadRequestException(`${user.nickname}님은 현재 게임을 할 수 있는 상태가 아닙니다.`);
    }

    if (sendUser.status !== UserStatus.ONLINE) {
      throw new BadRequestException(`${sendUser.nickname}님은 현재 게임을 할 수 있는 상태가 아닙니다.`);
    }

    await this.userService.updateUserStatus(user, UserStatus.PLAYING);
    await this.userService.updateUserStatus(user, UserStatus.PLAYING);

    // 여기에서 game방 객체를 만들던, gameID를 generate하던 gameID를 생성해줘야함
    // gameType = PRIVATE
    await this.eventsGateway.sendStartGameEvent(user, '1234');
    // this.gameService.creategame() 
    await this.eventsGateway.sendStartGameEvent(sendUser, '1234');

    return ({ message: `${user.nickname}님이 성공적으로 게임을 수락하셨습니다.` });
  }

  @Get('match/:mode')
  @UseGuards(AuthGuard())
  async startGameMatching(
    @GetAuth() auth: Auth,
    @Param('mode') mode: string,
  ):Promise<{ message: string }> {
    const user = await auth.user;

    if (this.eventsGateway.hasAlreadyGameMatching(user)) {
      throw new BadRequestException(`${user.nickname}님은 현재 다른 게임 매칭 대기중입니다.`);
    }
    const type = GameTypeEnum.LADDER;
    if (mode === GameModeEnum.NORMAL) {
      await this.eventsGateway.normalGameMatching(user, mode, type);
    }
    // FAST 삭제
    // else if (mode === GameModeEnum.FAST) {
    //   await this.eventsGateway.fastGameMatching(user, mode);
    // }
    else if (mode === GameModeEnum.OBJECT) {
      await this.eventsGateway.objectGameMatching(user, mode, type);
    }
    else {
      throw new BadRequestException(`${mode}모드는 현재 없는 모드입니다.`);
    }

    return ({ message: `성공적으로 매칭에 들어갔습니다.` });
  }

  @Delete('match/:mode')
  @UseGuards(AuthGuard())
  async cancelGameMatching(
    @GetAuth() auth: Auth,
    @Param('mode') mode: string,
  ):Promise<{ message: string }> {
    const user = await auth.user;

    if (mode === GameModeEnum.NORMAL) {
      this.eventsGateway.deleteNormalGameQueueUser(user.userID);
    }
    // else if (mode === GameModeEnum.FAST) {
    //   this.eventsGateway.deleteFastGameQueueUser(user.userID);
    // }
    else if (mode === GameModeEnum.OBJECT) {
      this.eventsGateway.deleteObjectGameQueueUser(user.userID);
    }
    else {
      throw new BadRequestException(`${mode}모드는 현재 없는 모드입니다.`);
    }

    return ({ message: `성공적으로 매칭을 취소했습니다.` });
  }
}
