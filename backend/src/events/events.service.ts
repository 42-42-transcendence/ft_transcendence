import { Injectable } from '@nestjs/common';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { EventsMemberDto } from './dto/events-member.dto';
import { User } from 'src/user/entities/user.entity';
import { RelationService } from 'src/relation/relation.service';
import { Socket } from 'socket.io';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelMemberRole } from 'src/channel-member/enums/channel-member-role.enum';
import { UserService } from 'src/user/user.service';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { GameOptionDto, InGameDto } from 'src/game/dto/in-game.dto';
import { GameModeEnum } from 'src/game/enums/gameMode.enum';
import { GameTypeEnum } from 'src/game/enums/gameType.enum';
import { GameService } from 'src/game/game.service';

@Injectable()
export class EventsService {
    constructor(
        private relationService: RelationService,
        private channelMemberService: ChannelMemberService,
        private userService: UserService,
        private gameService: GameService,
    ) {}

    private clients: Map<string, Socket> = new Map();

    private normalGameQueue: string[] = [];
    // private fastGameQueue: string[] = [];
    private objectGameQueue: string[] = [];

    addClient(userID: string, socket: Socket) {
        this.clients.set(userID, socket);
    }

    removeClient(userID: string) {
        this.clients.delete(userID);
    }

    getClient(userID: string): Socket | undefined  {
        return (this.clients.get(userID));
    }

    hasClient(userID: string): boolean {
        return (this.clients.has(userID));
    }

    addNormalGameQueueUser(userID: string) {
        this.normalGameQueue.push(userID);
    }

    deleteNormalGameQueueUser(userID: string) {
        const index = this.normalGameQueue.indexOf(userID);
        const client = this.getClient(userID);
        const gameId = this.gameService.getPlayerGameId(userID);

        if (index !== -1) {
            this.normalGameQueue.splice(index, 1);
            if (gameId && this.gameService.isActive(gameId))
                client.leave(gameId);
            else {
                this.gameService.deletePlayer(userID);
                this.gameService.deleteGameOption(gameId);
                this.gameService.deleteGameData(gameId);
            }
        }
    }

    hasNormalGameQueueUser(userID: string): boolean  {
        const index = this.normalGameQueue.indexOf(userID);

        if (index === -1) {
            return (false);
        }
        return (true);
    }

    async getReadyNormalGameUser(): Promise<User> {
        while (this.normalGameQueue.length > 0){
            const user = await this.userService.getUserByIdWithWsException(
                this.normalGameQueue.shift()
            );
            if (user.status === UserStatus.ONLINE) {
                return (user);
            }
        }
        return (undefined);
    }

    // addFastGameQueueUser(userID: string) {
    //     this.fastGameQueue.push(userID);
    // }

    // deleteFastGameQueueUser(userID: string) {
    //     const index = this.fastGameQueue.indexOf(userID);

    //     if (index !== -1) {
    //         this.fastGameQueue.splice(index, 1);
    //     }
    // }

    // hasFastGameQueueUser(userID: string): boolean  {
    //     const index = this.fastGameQueue.indexOf(userID);

    //     if (index === -1) {
    //         return (false);
    //     }
    //     return (true);
    // }

    // async getReadyFastGameUser(): Promise<User> {
    //     while (this.fastGameQueue.length > 0){
    //         const user = await this.userService.getUserByIdWithWsException(
    //             this.fastGameQueue.shift()
    //         );
    //         if (user.status === UserStatus.ONLINE) {
    //             return (user);
    //         }
    //     }
    //     return (undefined);
    // }

    addObjectGameQueueUser(userID: string) {
        this.objectGameQueue.push(userID);
    }

    deleteObjectGameQueueUser(userID: string) {
        const index = this.normalGameQueue.indexOf(userID);
        const client = this.getClient(userID);
        const gameId = this.gameService.getPlayerGameId(userID);

        if (index !== -1) {
            this.objectGameQueue.splice(index, 1);
            if (gameId && this.gameService.isActive(gameId))
                client.leave(gameId);
            else {
                this.gameService.cancelGame(userID, gameId);
            }
        }
    }

    hasObjectGameQueueUser(userID: string): boolean  {
        const index = this.objectGameQueue.indexOf(userID);

        if (index === -1) {
            return (false);
        }
        return (true);
    }

    async getReadyObjectGameUser(): Promise<User> {
        while (this.objectGameQueue.length > 0){
            const user = await this.userService.getUserByIdWithWsException(
                this.objectGameQueue.shift()
            );
            if (user.status === UserStatus.ONLINE) {
                return (user);
            }
        }
        return (undefined);
    }


    async createEventsMembers(members: ChannelMember[], user: User): Promise<EventsMemberDto[]> {
        let eventsMembers: EventsMemberDto[] = [];

        // forEach는 async에 대해서 기다려주지 않는다
        // 따라서 비동기함수에 대한 map을 만들고 Promise.all로 전체를 실행한다.
        const insertEventsMembers = members.map(async member => {
            if ((member.role === ChannelMemberRole.BLOCK)
                || (member.role === ChannelMemberRole.INVITE)) {
                return ;
            }
            const memberUser = await this.channelMemberService.getUserFromChannelMember(member);
            const relationType = await this.relationService.isBlockRelation(user, memberUser);
            const eventsMember = {
                userID: memberUser.userID,
                nickname: memberUser.nickname,
                image: memberUser.avatar,
                relation: relationType,
                role: member.role,
                isMuted: member.isMuted
            }
            eventsMembers.push(eventsMember);
        });
        await Promise.all(insertEventsMembers);

        return (eventsMembers);
    }

    /* ----------- GAME ------------- */

    async g_newGame(userId1: string, dto: GameOptionDto): Promise <string> {
        const gameID = await this.gameService.newGame(userId1, dto);
        return (gameID);
    }
    
    async g_joinGame(userId2: string, dto: InGameDto): Promise <GameOptionDto> {
        const gameOption = await this.gameService.joinGame(userId2, dto);
        return (gameOption);
    }

    async startGame(userId1: string, userId2: string, dto: GameOptionDto): Promise<string> {
        const gameId = await this.g_newGame(userId1, dto);
        if (!gameId){
            console.log("newGame Fail");
            this.gameService.deletePlayer(this.getClient(userId1).id);
            this.gameService.deleteGameOption(gameId);
            return null;
        }

        const inGameData: InGameDto = {
            displayName: "",
            gameId: gameId,
            player1: (await this.userService.getUserById(userId1)).nickname,
            player2: (await this.userService.getUserById(userId2)).nickname,
        }
        const gameOption = await this.g_joinGame(userId1, inGameData);
        if (!gameOption) {
            console.log("joinGame Fail");
            this.gameService.deletePlayer(this.getClient(userId1).id);
            this.gameService.deleteGameOption(gameId);
            return null;
        }
        console.log("ready to run engine!");
        this.gameService.startGameEngine(gameId);

        return (gameId);
        
    }
}
