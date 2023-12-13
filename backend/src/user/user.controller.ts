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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserinfoUserDto } from './dto/userinfo-user.dto';
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
import { DashboardUserDto } from './dto/dashboard-user.dto';
import { stringify } from 'querystring';

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
    summary: '유저 이미지 초기 설정',
  })
  @ApiOkResponse({
    description: '성공',
    type: User,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @Put('setup/avatar')
  async setupavatarUser(
    @GetAuth() auth: Auth,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (file) {
      return await this.userService.setupImageUser(file, auth);
    }
    else return { message: 'null image' };
  }
  //이미지 요청 response 필요

  @ApiOperation({
    summary: '유저 이미지 편집',
  })
  @ApiOkResponse({
    description: '성공',
    type: User,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('setup/avatar')
  async patchavatarUser(
    @GetAuth() auth: Auth,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (file) {
      return await this.userService.setupImageUser(file, auth);
    }
    else throw new BadRequestException(`입력된 이미지 파일이 없습니다.`);
  }

  @ApiOperation({
    summary: '유저 닉네임 설정, 유저 생성',
  })
  @ApiOkResponse({
    description: '성공',
    type: User,
  })
  @Put('setup/nickname')
  async setupnicknameUser(
    @Body('userID') userID: string,
    @GetAuth() auth: Auth,
  ): Promise<{ message: string }> {
     if (userID) {
      return await this.userService.createNicknameUser(userID, auth);
    } else return { message: 'wrong nickname' };
  }

  @ApiOperation({
    summary: '유저 프로필 보기',
  })
  @ApiOkResponse({
    description: '성공',
    type: User,
  })
  @Get('profile/:targetUserID')
  async getUserProfile(@Param('targetUserID') nickname): Promise<UserprofileUserDto> {
    const createdUser = await this.userService.getUserByNicknameWithException(nickname);
    const achievementslist = await this.userService.getAchievements(createdUser);
    const userprofile = await this.userService.getUserProfile(createdUser, achievementslist);
    return userprofile;
  }
  
  @ApiOperation({
    summary: '채팅창 모달에서 유저 정보 보기',
  })
  @ApiOkResponse({
    description: '성공',
    type: UserinfoUserDto,
  })
  @Get('/:targetUserID')
  async getUserInfo(@Param('targetUserID') UserID, @GetAuth() auth: Auth): Promise<UserinfoUserDto> {
    const targetuser = await this.userService.getUserByNicknameWithException(UserID);
    const currentuser = await auth.user;
    const relation = (await this.RelationService.getRelationByUsersWithunknown(currentuser, targetuser));
    
    if (relation == null) return await this.userService.getUserInfo(targetuser, RelationTypeEnum.UNKNOWN);
    else return await this.userService.getUserInfo(targetuser, relation.relationType);
  }

  @ApiOperation({
    summary: '유저 전적 보기',
  })
  @ApiOkResponse({
    description: '성공',
    type: [ChannelMember],
  })
  @Get('dashboard/:targetUserID')
  async getDashboards(@Param('targetUserID') userID: string, @GetAuth() auth: Auth): Promise<DashboardUserDto[]> {
    return await this.userService.getDashboards(userID, auth);
  }

}
