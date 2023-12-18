/* eslint-disable object-property-newline */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserprofileUserDto } from './dto/userprofile-user.dto';
import { UserStatus } from './enums/user-status.enum';
import { AuthRepository } from 'src/auth/auth.repository';
import { Auth } from 'src/auth/entities/auth.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';
import { SocketException } from 'src/events/socket.exception';
import { UserAchievementlistDto } from 'src/user-achievement/dto/user-ahievement-list.dto';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { Achievements, achievements } from 'src/achievement/achievement';
import { UserinfoUserDto } from './dto/userinfo-user.dto';
import { GameService } from 'src/game/game.service';
import { DashboardUserDto } from './dto/dashboard-user.dto';
import { GameTypeEnum } from 'src/game/enums/gameType.enum';
import { GameModeEnum } from 'src/game/enums/gameMode.enum';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authrepository: AuthRepository,
	private gameservice: GameService,
  ) {}

	async getJoinChannels(userID: string): Promise<ChannelMember[]> {
		return (this.userRepository.getJoinChannels(userID));
	}


	async getUserByNickname(nickname: string): Promise<User> {
		return (await this.userRepository.getUserByNickname(nickname));
	}

	async getUserByNicknameWithException(nickname: string): Promise<User> {
		const user = await this.userRepository.getUserByNickname(nickname);

		if (!user) {
			throw new NotFoundException(`${nickname}을 가진 유저를 찾을 수 없습니다.`);
		}

		return (user);
	}

	async getUserByNicknameWithWsException(nickname: string): Promise<User> {
		const user = await this.userRepository.getUserByNickname(nickname);

		if (!user) {
			throw new SocketException('NotFound', `${nickname}을 가진 유저를 찾을 수 없습니다.`);
		}

		return (user);
	}

	async getUserById(userID: string): Promise<User> {
		return (await this.userRepository.getUserById(userID));
	}

	async getUserByIdWithException(userID: string): Promise<User> {
		const user = await this.userRepository.getUserById(userID);

		if (!user) {
			throw new NotFoundException(`${userID}를 찾을 수 없습니다.`);
		}

		return (user);
	}

	async getUserByIdWithWsException(userID: string): Promise<User> {
		const user = await this.userRepository.getUserById(userID);

		if (!user) {
			throw new SocketException('NotFound', `${userID}을 가진 유저를 찾을 수 없습니다.`);
		}

		return (user);
	}

	async createUserDummy(): Promise<User> {
		return this.userRepository.createUserDummy();
	}
	
	async createUser(nickname: string): Promise<User> {
		return await this.userRepository.createUser(nickname);
	}
	
	async createNicknameUser(userID: string, auth: Auth): Promise<{ message: string }> {
		if (await auth.user)
		{
			throw new BadRequestException(`이미 생성된 유저입니다.`);
		}
		if (userID.length < 4 || userID.length > 8) {
			throw new BadRequestException(`닉네임 길이가 너무 짧거나 깁니다.`);
		}
		const user = await this.getUserByNickname(userID);
		if (user) {
		throw new BadRequestException(`${userID}를 가진 유저가 이미 있습니다.`);
		}
		const createdUser = await this.userRepository.createUser(userID);
		await this.authrepository.relationAuthUser(auth, createdUser);
		console.log('-------------- user db saved --------------');
		const ret = { message: 'user db saved' };
		return ret;
	}
  
	async setupImageUser(file: Express.Multer.File, auth: Auth): Promise<{ message: string }> {
		console.log(file);
		if (file.size > 3000000){
			throw new BadRequestException(`파일 크기가 3MB를 넘습니다.`);
		}
		console.log((await auth.user).nickname);
		const authuid = (await auth.user).userID; 
		const extension = file.originalname.split('.').pop().toLowerCase();;
		if (extension != 'jpeg' && extension != 'png' && extension != 'jpg' && extension != 'gif'){
			throw new BadRequestException(`이미지 형식만 프로필로 설정 가능합니다. (jpeg, png, jpg, gif)`);
		}
		const filePath = path.join(__dirname, `../../assets/profiles/${authuid}.${extension}`);
		await fs.writeFile(filePath, file.buffer);
		await this.userRepository.setUserAvatar(await auth.user, extension);
		console.log('-------------- file saved --------------');

		const ret = { message: 'file saved' };
		return ret;
	}

  	async getUserProfile(user: User, achievementslist:UserAchievementlistDto[]): Promise<UserprofileUserDto> {
		const userinfo: UserprofileUserDto = {
		nickname: user.nickname,
		image: user.avatar,
		winCount: user.win,
		loseCount: user.lose,
		ladderPoint: user.point,
		achievements: achievementslist,
		};
		return userinfo;
  	}

  	async getAchievements(user: User): Promise<UserAchievementlistDto[]> {
		const retlist: UserAchievementlistDto[] = [];
    	if (user.win >= 1 || user.lose >= 1) user.userAchievementbool[1] = true;
		if (user.win >= 1) user.userAchievementbool[2] = true;
		if (user.win >= 10) user.userAchievementbool[3] = true;
    	if (user.win >= 42) user.userAchievementbool[4] = true;
    	if (user.lose >= 1) user.userAchievementbool[5] = true;

		for (let i = 0; i < 10; i ++){
			retlist.push({
				id: achievements[i].id,
				title: achievements[i].name,
				description: achievements[i].description,
				isAchieved: user.userAchievementbool[i]
			})
		}
		await this.userRepository.save(user);
		return retlist;
		// return this.userRepository.getAchivements(User);
  	}

  	async changeStatus(nickname: string, status: UserStatus) {
    	this.userRepository.changeStatus(nickname, status);
    	// const createduser = await this.getUserByNickname(nickname);
    	// createduser.status = status;
    	// await this.save(createduser);
	}

	async getAllUsers(): Promise<User[]> {
		return (await this.userRepository.getAllUsers());
	}

	async updateUserStatus(user: User, status: UserStatus): Promise<User> {
		return (await this.userRepository.updateUserStatus(user, status));
	}

	async saveOtpAuthSecret(user: User, secret: string): Promise<User> {
		return (await this.userRepository.saveOtpAuthSecret(user, secret));
	}

	async turnOnOtp(user: User): Promise<User> {
		return (await this.userRepository.turnOnOtp(user));
	}

	async removeOtpAuthSecret(user: User): Promise<User> {
		return (await this.userRepository.removeOtpAuthSecret(user));
	}

	async getUserInfo(user: User, relationtype: RelationTypeEnum): Promise<UserinfoUserDto>{
	const userinfo = {
		nickname: user.nickname,
		image: user.avatar,
		status: user.status,
		relation: relationtype,
	};
		return userinfo;
	}

	async createDummyDashboards(targetuserID: string, auth: Auth): Promise<DashboardUserDto[]>{
		const user = await this.getUserByNicknameWithException(targetuserID);
		const retDashboards: DashboardUserDto[] = [];
		for (let i = 0; i < 10; i++){
			const currentgameid = `uuid${i}`;
			const tmpboard:DashboardUserDto = {
				id: currentgameid,
				nickname: `dummyuser${i}`,
				image: user.avatar,
				mode: i%2 === 1 ? GameModeEnum.NORMAL : GameModeEnum.OBJECT,
				isWin: i%2 === 1 ? true : false,
				type: i%2 === 1 ? GameTypeEnum.LADDER : 'friendly',
				score: `${i}:${i}`,
			}
			retDashboards.push(tmpboard);
		}
		return retDashboards;
		}

	async getDashboards(targetuserID: string, auth: Auth): Promise<DashboardUserDto[]>{
	const user = await this.getUserByNicknameWithException(targetuserID);
	const retDashboards: DashboardUserDto[] = [];
	if(!user.matchHistory)
		return retDashboards;
	for (let i = 0; i < user.matchHistory.length; i++){
		const currentgame = await this.gameservice.findGameById(user.matchHistory[i]);
		const targetUser:User = currentgame.player1 === user.nickname ? await this.getUserByNicknameWithException(currentgame.player2) : await this.getUserByNicknameWithException(currentgame.player1);
		const tmpboard:DashboardUserDto = {
			id: currentgame.gameID,
			nickname: targetUser.nickname,
			image: targetUser.avatar,
			mode: currentgame.gameMode,
			isWin: currentgame.winner === user.nickname ? true : false,
			type: currentgame.gameType === GameTypeEnum.LADDER ? GameTypeEnum.LADDER : 'friendly',
			score: `${currentgame.player1Score}:${currentgame.player2Score}`,
		}
		retDashboards.push(tmpboard);
	}
	return retDashboards;
	}

	async endGameUser(nickname: string, matchId : string, isWin:boolean) : Promise<void> {
		const game = await this.gameservice.findGameById(matchId);
		const user = await this.getUserByNickname(nickname);

		if (nickname) {
			// console.log(`game ID: ${game.gameID}`);
			// console.log(`game finished: ${game.finished}`);
			// console.log(`game date: ${game.date}`);
			// console.log(`game mode: ${game.gameMode}`);
			// console.log(`game type: ${game.gameType}`);
			// console.log(`game WINNER: ${game.winner}`);
			// console.log(`PLAYER 1: ${game.player1}`);
			// console.log(`PLAYER 2: ${game.player2}`);
			// console.log(`PLAYER1 score: ${game.player1Score}`);
			// console.log(`PLAYER2 score: ${game.player2Score}`);
			user.matchHistory.push(matchId);
			if (isWin === true) {
				user.win += 1;
				if (game.gameType === GameTypeEnum.LADDER)
				{
					user.userAchievementbool[6] = true;
					user.point += 20;
					if (user.point >= 1200)
						user.userAchievementbool[7] = true;
					if (user.point >= 1400)
						user.userAchievementbool[8] = true;
					if (user.point >= 1600)	
						user.userAchievementbool[9] = true;
				}
			}
			else {
				user.lose += 1;
				if (game.gameType === GameTypeEnum.LADDER)
				{
					user.userAchievementbool[6] = true;
					user.point -= 20;
				}
			}
			await this.userRepository.save(user);
		}
	}
}
