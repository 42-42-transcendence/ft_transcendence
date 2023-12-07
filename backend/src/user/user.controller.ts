import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  Query,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UerinfoUserDto } from './dto/userinfo-user.dto';
import { UserprofileUserDto } from './dto/userprofile-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { RelationService } from '../relation/relation.service';
import { userInfo } from 'os';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';

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
  @UseInterceptors(FileInterceptor('avatar'))
  @Put('setup')
  async createUser(
    @Body('userID') userID: string,
    @GetAuth() auth: Auth,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (file) {
      console.log('profile image set');
    }
    console.log('------------------------- userID -------------------------');
    // 닉네임 업데이트 요청인 경우
    console.log(userID);

    const createdUser = await this.userService.createUser(userID);
    this.userService.relationAuthUser(createdUser, auth);

    const ret = {
      message: createdUser.nickname || 'ok2', // 여기서 필요에 따라 적절한 값을 반환
    };
    console.log('ok2');
    return ret;
  }
  //이미지 요청 response 필요

  @ApiOperation({
    summary: '유저 프로필 보기',
  })
  @ApiOkResponse({
    description: '성공',
    type: User,
  })
  @Get('profile/:targetUserID')
  async getUserProfile(@Param('targetUserID') nickname): Promise<UserprofileUserDto> {
    const createdUser = await this.userService.getUserByNickname(nickname);
    const createdUserd = await this.userService.getAchievements(createdUser);
    console.log(createdUserd.userAchievements[0].achievement.description);
    const userprofile = await this.userService.getUserProfile(createdUserd);
    return userprofile;
  }

  @ApiOperation({
    summary: '채팅창 모달에서 유저 정보 보기',
  })
  @ApiOkResponse({
    description: '성공',
    type: UerinfoUserDto,
  })
  @Get('user/:userid')
  async getUserInfo(@Param('userid') UserID, @GetAuth() auth: Auth): Promise<UerinfoUserDto> {
    const createdUser = await this.userService.getUserByNickname(UserID);
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
