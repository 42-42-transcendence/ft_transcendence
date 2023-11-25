import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UerinfoUserDto } from './dto/userinfo-user.dto';
import { UerprofileUserDto } from './dto/userprofile-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { RelationService } from '../relation/relation.service';
import { userInfo } from 'os';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';

@ApiTags('USER')
@Controller('api/user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(
    private userService: UserService,
    private RelationService: RelationService,
  ) {}

  @ApiOperation({
    summary: '유저의 현재 접속한 전체 채널 조회',
  })
  @ApiOkResponse({
    description: '성공',
    type: [ChannelMember],
  })
  @Get(':id/channels')
  async getJoinChannels(@Param('id') userID: string): Promise<ChannelMember[]> {
    return this.userService.getJoinChannels(userID);
  }

  @ApiOperation({
    summary: '유저 생성',
  })
  @ApiOkResponse({
    description: '성공',
    type: User,
  })
  @Post('setting-profile')
  async createUser(@Body() CreateUserDto: CreateUserDto): Promise<CreateUserDto> {
    const createdUser = await this.userService.createUser(CreateUserDto);
    const nickname = {
      nickname: createdUser.nickname,
    };
    return nickname;
  }

  @ApiOperation({
    summary: '유저 본인 프로필 보기',
  })
  @ApiOkResponse({
    description: '성공',
    type: User,
  })
  @Get('profile/:user')
  async getUserProfile(@Param('user') UserID): Promise<UerprofileUserDto> {
    const createdUser = await this.userService.getUserByNickname(UserID);
    const userinfo = {
      nickname: createdUser.nickname,
      image: createdUser.avatar,
      win: createdUser.win,
      lose: createdUser.lose,
      point: createdUser.point,
      userAchievements: createdUser.userAchievements,
    };
    return userinfo;
  }

  @ApiOperation({
    summary: '유저 정보 보기',
  })
  @ApiOkResponse({
    description: '성공',
    type: UerinfoUserDto,
  })
  @Get('user/:userid')
  async getUserInfo(@Param('userid') UserID, @GetAuth() auth: Auth): Promise<UerinfoUserDto> {
    const createdUser = await this.userService.getUserById(UserID);
    const firstuser = await auth.user;
    let relation = (await this.RelationService.getRelationByUsersWithException(firstuser, createdUser)).relationType;
    if (relation == null) {
      relation = RelationTypeEnum.UNKNOWN;
    }
    const userinfo = {
      nickname: createdUser.nickname,
      image: createdUser.avatar,
      status: createdUser.status,
      relation: relation,
    };
    return userinfo;
  }
}
