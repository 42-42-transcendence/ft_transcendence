import { Module, forwardRef } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { RelationRepository } from './relation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relation } from './entities/relation.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => EventsModule),
    TypeOrmModule.forFeature([Relation]),
    AuthModule,
  ],
  controllers: [RelationController],
  providers: [RelationService, RelationRepository],
  exports: [RelationService]
})
export class RelationModule {}
