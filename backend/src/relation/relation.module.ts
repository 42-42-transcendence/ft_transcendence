import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';

@Module({
  controllers: [RelationController],
  providers: [RelationService],
})
export class RelationModule {}
