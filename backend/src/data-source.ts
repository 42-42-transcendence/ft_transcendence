import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
export default new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'ts',
  password: 'ts',
  database: 'ts',
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  // migrations: ['src/database/migrations/*.ts'],
  // migrationsTableName: 'migrations',
});
