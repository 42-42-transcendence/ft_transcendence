import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RelationModule } from 'src/relation/relation.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => RelationModule),
    GameModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
