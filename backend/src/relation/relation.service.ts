import { Injectable, NotFoundException } from '@nestjs/common';
import { RelationDto } from './dto/relation.dto';
import { RelationRepository } from './relation.repository';
import { Relation } from './entities/relation.entity';
import { RelationType } from 'typeorm/metadata/types/RelationTypes';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RelationService {
  constructor(private relationRepository: RelationRepository){}

  async createRelation(relationDto: RelationDto): Promise<Relation> {
    return (this.relationRepository.createRelation(relationDto));
  }

  async getRelationByUsers(subjectUser: User, objectUser: User): Promise<Relation> {
    const relations = await subjectUser.subjectRelations;
    const relation = relations.find(relation => relation.objectUser.userID === objectUser.userID);

    if (!relation)
      throw new NotFoundException('없는 User 관계입니다.');

    return (relation);
  }

  async updateRelation(relationDto: RelationDto): Promise<Relation> {
    const { subjectUser, objectUser, relationType } = relationDto;
    const relation = await this.getRelationByUsers(subjectUser, objectUser);

    return (this.relationRepository.updateRelation(relation, relationType));
  }

  async deleteRelation(subjectUser: User, objectUser: User) {
    const relation = await this.getRelationByUsers(subjectUser, objectUser);

    this.relationRepository.deleteRelation(relation.relationID);
  }

}
