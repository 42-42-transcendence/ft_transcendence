import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { RelationRepository } from './relation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relation } from './entities/relation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relation]),
  ],
  controllers: [RelationController],
  providers: [RelationService, RelationRepository],
  exports: [RelationService]
})
export class RelationModule {}
