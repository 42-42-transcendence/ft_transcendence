import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { UserModule } from "../user/user.module";
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { GameEngine } from './game.engine';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    forwardRef(() =>UserModule),
    forwardRef(() =>AuthModule),
    forwardRef(() => EventsModule),
    NotificationModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway, GameEngine],
  exports: [GameService]
})
export class GameModule {}