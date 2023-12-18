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
import { GameDataDto, GameOptionDto } from 'src/game/dto/in-game.dto';
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

    addNormalGameQueueUser(userID: string) {
        this.normalGameQueue.push(userID);
    }

    async deleteNormalGameQueueUser(userID: string) {
        const user = await this.userService.getUserById(userID);
        const index = this.normalGameQueue.indexOf(userID);
        const gameId = await this.gameService.getPlayerGameId(user.nickname);

        if (index !== -1) {          
            if (gameId)
                this.gameService.cancelGame(user.nickname, gameId, "cancel");
            this.normalGameQueue.splice(index, 1);
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


    addObjectGameQueueUser(userID: string) {
        this.objectGameQueue.push(userID);
    }

    async deleteObjectGameQueueUser(userID: string) {
        const user = await this.userService.getUserById(userID);
        const index = this.objectGameQueue.indexOf(userID);
        const gameId = await this.gameService.getPlayerGameId(user.nickname);

        if (index !== -1) {            
            if (gameId)
                this.gameService.cancelGame(user.nickname, gameId, "cancel");
            this.objectGameQueue.splice(index, 1);
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
    
    g_startGame(userNickname1: string, userNickname2: string, dto: GameOptionDto, data: GameDataDto) {
        const gameID = this.gameService.startGame(userNickname1, userNickname2, dto, data);
        return (gameID);
    }

    g_startGameLoop(gameid: string){
        this.gameService.startGameEngine(gameid);
    }

    async startGame(userNickname1: string, userNickname2: string, dto: GameOptionDto, data: GameDataDto): Promise<string> {
        const gameId = await this.g_startGame(userNickname1, userNickname2, dto, data);
        if (!gameId){
            this.gameService.cancelGame(userNickname1, gameId, "cancel");
            this.gameService.cancelGame(userNickname2, gameId, "cancel");
            return null;
        }

        return (gameId);
    }
}
