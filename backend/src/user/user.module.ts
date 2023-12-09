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
import { AchievementModule } from 'src/achievement/achievement.module';
import { UserAchievementRepository } from 'src/user-achievement/user-achievement.repository';
import { AchievementRepository } from 'src/achievement/achievement.repository';
import { AuthRepository } from 'src/auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    RelationModule,
    UserAchievementModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserAchievementRepository, AchievementRepository, AuthRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
