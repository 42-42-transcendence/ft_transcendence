import { Injectable } from '@nestjs/common';
import { CreateRelationDto } from './dto/create-relation.dto';
import { UpdateRelationDto } from './dto/update-relation.dto';

@Injectable()
export class RelationService {
  create(createRelationDto: CreateRelationDto) {
    return 'This action adds a new relation';
  }

  findAll() {
    return `This action returns all relation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relation`;
  }

  update(id: number, updateRelationDto: UpdateRelationDto) {
    return `This action updates a #${id} relation`;
  }

  remove(id: number) {
    return `This action removes a #${id} relation`;
  }
}
