import { Injectable } from '@nestjs/common';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { EventsMemberDto } from './dto/events-member.dto';
import { User } from 'src/user/entities/user.entity';
import { RelationService } from 'src/relation/relation.service';

@Injectable()
export class EventsService {
    constructor(private relationService: RelationService) {}

    async createEventsMembers(members: ChannelMember[], user: User): Promise<EventsMemberDto[]> {
        let eventsMembers: EventsMemberDto[] = [];
    
        // 지금 이게 돌기전에 먼저 배열이 리턴된다
        members.forEach(async member => {
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
            console.log('eventsMember: ', eventsMember);
            eventsMembers.push(eventsMember);
        });

        console.log('eventsMembers: ', eventsMembers);

        return (eventsMembers);
    }
}
