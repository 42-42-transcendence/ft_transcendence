import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { UserModule } from "../user/user.module";
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UserModule],
  controllers: [GameController],
  providers: [GameService, GameGateway, UserService],
})
export class GameModule {}
