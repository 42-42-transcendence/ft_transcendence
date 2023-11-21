import { Injectable } from '@nestjs/common';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { EventsMemberDto } from './dto/events-member.dto';
import { User } from 'src/user/entities/user.entity';
import { RelationService } from 'src/relation/relation.service';
import { Socket } from 'socket.io';

@Injectable()
export class EventsService {
    constructor(private relationService: RelationService) {}

    private clients: Map<string, Socket> = new Map();

    addClient(userID: string, socket: Socket) {
        this.clients.set(userID, socket);
    }

    removeClient(userID: string) {
        this.clients.delete(userID);
    }

    getClient(userID: string): Socket | undefined  {
        return (this.clients.get(userID));
    }

    async createEventsMembers(members: ChannelMember[], user: User): Promise<EventsMemberDto[]> {
        let eventsMembers: EventsMemberDto[] = [];

        // forEach는 async에 대해서 기다려주지 않는다
        // 따라서 비동기함수에 대한 map을 만들고 Promise.all로 전체를 실행한다.
        const insertEventsMembers = members.map(async member => {
            const memberUser = await member.user;
            const relationType = await this.relationService.isBlockRelation(user, memberUser);
            const eventsMember = {
                userID: memberUser.userID,
                nickname: memberUser.nickname,
                image: '',
                relation: relationType,
                role: member.role,
                isMuted: member.isMuted
            }
            eventsMembers.push(eventsMember);
        });
        await Promise.all(insertEventsMembers);

        return (eventsMembers);
    }
}
