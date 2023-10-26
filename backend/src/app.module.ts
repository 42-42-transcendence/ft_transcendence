import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
  ],
})

export class AppModule {}
