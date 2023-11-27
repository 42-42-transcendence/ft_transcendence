import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { Game } from 'src/game/entities/game.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RelationModule } from 'src/relation/relation.module';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, RelationModule, UserAchievementModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
