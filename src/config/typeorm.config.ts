import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

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
  entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
  //entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: db.synchronize,
};
