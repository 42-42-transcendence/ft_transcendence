import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { UserModule } from "../user/user.module";
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/events/events.module';
import { NotificationModule } from 'src/notification/notification.module';
import { GameEngine } from './game.engine';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    UserModule,
    AuthModule,
    EventsModule,
    NotificationModule
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway, GameEngine],
})
export class GameModule {}
