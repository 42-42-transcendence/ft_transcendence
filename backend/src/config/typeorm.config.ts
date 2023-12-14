import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'host.docker.internal',
  port: +process.env.POSTGRES_PORT,
  username: 'ts_user',
  password: 'ts_pass',
  database: 'ts_db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  logging: true,
};
