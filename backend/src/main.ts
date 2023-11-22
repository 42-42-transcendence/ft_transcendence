import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from './adapters/socket-io.adapter';
import { SocketExceptionFilter } from './events/socket.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  // app.useGlobalFilters(new SocketExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence API')
    .setDescription('ft_transcendence 개발을 위한 API 문서입니다.')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
