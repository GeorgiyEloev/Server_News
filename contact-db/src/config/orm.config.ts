import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from 'dotenv';

config();

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  // host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
  synchronize: false,
  autoLoadEntities: true,
  migrationsRun: true,
  logging: true,
};

export const OrmConfig = {
  ...typeOrmModuleOptions,
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
export default OrmConfig;
