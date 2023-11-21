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
            eventsMembers.push(eventsMember);
        });

        return (eventsMembers);
    }
}
