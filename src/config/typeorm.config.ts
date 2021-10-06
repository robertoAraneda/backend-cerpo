import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { join } from 'path';

const db = config.get('db');

export const typeormConfig: TypeOrmModuleOptions = {
  type: db.type,
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  //logging: 'all',
  //autoLoadEntities: true,
  //entities: [join(__dirname, '../**', 'entities/*.entity.{ts,js}')],
  //entities: ['dist/**/entities/*.entity.js'],
  entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
  //entities: ['dist/**/entities/*.entity.js'],
  synchronize: db.synchronize,
};
