import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Relation } from "./entities/relation.entity";
import { RelationDto } from "./dto/relation.dto";
import { RelationType } from "typeorm/metadata/types/RelationTypes";
import { RelationTypeEnum } from "./enums/relation-type.enum";

@Injectable()
export class RelationRepository extends Repository<Relation> {
	constructor(private dataSource: DataSource) {
		super(Relation, dataSource.createEntityManager());
	}

	async createRelation(relationDto: RelationDto): Promise<Relation> {
		const { subjectUser, objectUser, relationType } = relationDto;

		const relation = this.create({
			subjectUser,
			objectUser,
			relationType
		});
		const result = await this.save(relation);

		return (result);
	}

	async updateRelation(relation: Relation, relationType: RelationTypeEnum): Promise<Relation> {
		relation.relationType = relationType;

		const result = await this.save(relation);

		return (result);
	}

	async deleteRelation(relationID: string) {
		const result = await this.delete(relationID);

		if (result.affected === 0)
			throw new NotFoundException('없는 User 관계입니다.');
	}

}
