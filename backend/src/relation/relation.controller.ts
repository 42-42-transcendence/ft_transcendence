import { Controller, Param, Delete, UseGuards, BadRequestException, Get } from '@nestjs/common';
import { RelationService } from './relation.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { UserService } from 'src/user/user.service';
import { RelationTypeEnum } from './enums/relation-type.enum';
import { EventsGateway } from 'src/events/events.gateway';
import { NotiType } from 'src/notification/enums/noti-type.enum';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialDto } from './dto/social.dto';

@ApiTags('RELATION')
@Controller('api/relation')
@UseGuards(AuthGuard())
export class RelationController {
  constructor(
    private relationService: RelationService,
    private userService: UserService,
    private eventsGateway: EventsGateway,
  ) {}


  @ApiOperation({
    summary: '현재 사람들간의 관계들을 반환한다'
  })
  @ApiOkResponse({
    description: '성공',
    type: [SocialDto]
  })
  @Get()
  async getSocialsByUser(
    @GetAuth() auth: Auth,
  ): Promise<SocialDto[]> {
    const user = await auth.user;
    const relations = await this.relationService.getRelationsByUser(user);
    let socials: SocialDto[] = [];

    const insertSocials = relations.map(async relation => {
      const objectUser = await this.relationService.getObjectUserByRelation(relation);
      if (!objectUser) {
        return ;
      }
      const social = {
        nickname: objectUser.nickname,
        image: objectUser.avatar,
        status: objectUser.status,
        relation: relation.relationType,
      }
      socials.push(social);
    });
    await Promise.all(insertSocials);

    return (socials);
  }


  @ApiOperation({
    summary: '특정 인원을 친구추가 한다.'
  })
  @ApiOkResponse({
    description: '성공',
    type: String
  })
  @Get('friend/:targetUserID')
  async addFriend(
    @GetAuth() auth: Auth,
    @Param('targetUserID') targetUser: string,
  ):Promise<{ message: string }> {
    const user = await auth.user;
    const addFriendUser = await this.userService.getUserByNicknameWithException(targetUser);
    const relation = await this.relationService.getRelationByUsers(user, addFriendUser);

    if (relation) {
      if (relation.relationType === RelationTypeEnum.FRIEND) {
        throw new BadRequestException(`${targetUser}와는 이미 친구추가가 되어있습니다.`);
      }
      if (relation.relationType === RelationTypeEnum.BLOCK) {
        throw new BadRequestException(`${targetUser}와는 블락관계입니다. 블락을 해제하시고 친구를 추가해주세요.`);
      }
    }

    await this.relationService.createRelation({
      subjectUser: user,
      objectUser: addFriendUser,
      relationType: RelationTypeEnum.FRIEND
    });

    await this.eventsGateway.updatedNotification(
      `${user.nickname}님께서 당신을 친구추가 하셨습니다.`,
      NotiType.FRIEND,
      addFriendUser
    );

    return ({ message: `${targetUser}를 친구 추가 하였습니다.` });
  }


  @ApiOperation({
    summary: '특정 인원을 친구 해제 한다.'
  })
  @ApiOkResponse({
    description: '성공',
    type: String
  })
  @Delete('friend/:targetUserID')
  async deleteFriend(
    @GetAuth() auth: Auth,
    @Param('targetUserID') targetUser: string,
  ):Promise<{ message: string }> {
    const user = await auth.user;
    const deleteFriendUser = await this.userService.getUserByNicknameWithException(targetUser);
    const relation = await this.relationService.getRelationByUsers(user, deleteFriendUser);

    if (!relation || (relation.relationType === RelationTypeEnum.BLOCK)) {
      throw new BadRequestException(`${targetUser}와는 현재 친구관계가 아닙니다.`);
    }

    await this.relationService.deleteRelation(user, deleteFriendUser);

    return ({ message: `${targetUser}를 친구에서 제거 하였습니다.` })
  }

  
  @ApiOperation({
    summary: '특정 인원을 차단하거나 차단해제한다.'
  })
  @ApiOkResponse({
    description: '성공',
    type: String
  })
  @Get('block/:targetUserID')
  async toggleBlockUser(
    @GetAuth() auth: Auth,
    @Param('targetUserID') targetUser: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const blockedUser = await this.userService.getUserByNicknameWithException(targetUser);
    const relation = await this.relationService.getRelationByUsers(user, blockedUser);

    if (!relation) {
      await this.relationService.createRelation({
        subjectUser: user,
        objectUser: blockedUser,
        relationType: RelationTypeEnum.BLOCK
      });
    }
    else if (relation.relationType === RelationTypeEnum.BLOCK) {
      await this.relationService.deleteRelation(user, blockedUser);
    }
    else {
      await this.relationService.updateRelationByRelation(relation, RelationTypeEnum.BLOCK);
    }

    return ({ message: `${blockedUser.nickname}님을 차단했습니다.` })
  }
}
