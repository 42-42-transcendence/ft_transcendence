import { Injectable, NotFoundException } from '@nestjs/common';
import { RelationDto } from './dto/relation.dto';
import { RelationRepository } from './relation.repository';
import { Relation } from './entities/relation.entity';
import { User } from 'src/user/entities/user.entity';
import { RelationTypeEnum } from './enums/relation-type.enum';

@Injectable()
export class RelationService {
  constructor(private relationRepository: RelationRepository) {}

  async createRelation(relationDto: RelationDto): Promise<Relation> {
    return this.relationRepository.createRelation(relationDto);
  }

  async getRelationByUsers(subjectUser: User, objectUser: User): Promise<Relation> {
    return await this.relationRepository.getRelationByUsers(subjectUser, objectUser);
  }

  async getRelationByUsersWithException(subjectUser: User, objectUser: User): Promise<Relation> {
    const relation = await this.getRelationByUsers(subjectUser, objectUser);

    if (!relation) throw new NotFoundException('없는 User 관계입니다.');

    return relation;
  }

  async getRelationByUsersWithunknown(subjectUser: User, objectUser: User): Promise<Relation> {
    const relation = await this.getRelationByUsers(subjectUser, objectUser);

    if (!relation) return null;

    return relation;
  }

  async isBlockRelation(subjectUser: User, objectUser: User): Promise<RelationTypeEnum> {
    const relation = await this.getRelationByUsers(subjectUser, objectUser);

    if (!relation || relation.relationType !== RelationTypeEnum.BLOCK) {
      return RelationTypeEnum.UNKNOWN;
    }
    return RelationTypeEnum.BLOCK;
  }

  async updateRelation(relationDto: RelationDto): Promise<Relation> {
    const { subjectUser, objectUser, relationType } = relationDto;
    const relation = await this.getRelationByUsersWithException(subjectUser, objectUser);

    return await this.relationRepository.updateRelation(relation, relationType);
  }

  async updateRelationByRelation(relation: Relation, relationType: RelationTypeEnum): Promise<Relation> {
    return await this.relationRepository.updateRelation(relation, relationType);
  }

  async deleteRelation(subjectUser: User, objectUser: User) {
    const relation = await this.getRelationByUsersWithException(subjectUser, objectUser);

    this.relationRepository.deleteRelation(relation.relationID);
  }

  async getRelationsByUser(subjectUser: User): Promise<Relation[]> {
    return (await this.relationRepository.getRelationsByUser(subjectUser));
  }

  async getObjectUserByRelation(relation: Relation): Promise<User> {
    return (await this.relationRepository.getObjectUserByRelation(relation));
  }
}
