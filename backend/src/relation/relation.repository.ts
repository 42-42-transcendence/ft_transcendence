import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Relation } from './entities/relation.entity';
import { RelationDto } from './dto/relation.dto';
import { RelationType } from 'typeorm/metadata/types/RelationTypes';
import { RelationTypeEnum } from './enums/relation-type.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RelationRepository extends Repository<Relation> {
  constructor(private dataSource: DataSource) {
    super(Relation, dataSource.createEntityManager());
  }

  async createRelation(relationDto: RelationDto): Promise<Relation> {
    const { subjectUser, objectUser, relationType } = relationDto;

		const relation = new Relation();
		relation.subjectUser = subjectUser;
		relation.objectUser = objectUser;
		relation.relationType = relationType;
		const result = await this.save(relation);

    return result;
  }

  async updateRelation(relation: Relation, relationType: RelationTypeEnum): Promise<Relation> {
    relation.relationType = relationType;

    const result = await this.save(relation);

    return result;
  }

  async deleteRelation(relationID: string) {
    const result = await this.delete(relationID);

    if (result.affected === 0) throw new NotFoundException('없는 User 관계입니다.');
  }

	async getRelationByUsers(subjectUser: User, objectUser: User): Promise<Relation> {

		// where, andwhere의 변수를 같은 이름으로 지으면 안된다...
		const relation = await this
			.createQueryBuilder('relation')
			.leftJoinAndSelect('relation.subjectUser', 'subjectUser')
			.leftJoinAndSelect('relation.objectUser', 'objectUser')
			.where('subjectUser.userID = :subjectUserID', { subjectUserID: subjectUser.userID })
			.andWhere('objectUser.userID = :objectUserID', { objectUserID: objectUser.userID })
			.getOne();

    return relation;
  }

  async getRelationsByUser(subjectUser: User): Promise<Relation[]> {
    const relations = await this
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.subjectUser', 'subjectUser')
      .where('subjectUser.userID = :subjectUserID', { subjectUserID: subjectUser.userID })
      .getMany();
    
    return (relations);
  }

  async getObjectUserByRelation(relation: Relation): Promise<User> {
    const objectUser = await this
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.objectUser', 'objectUser')
      .where('relation.relationID = :relationID', { relationID: relation.relationID })
      .getOne();

    return (relation.objectUser);
  }
}
