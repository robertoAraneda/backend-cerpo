import { createConnection } from 'typeorm';

export async function createMemDB() {
  return createConnection({
    // name, // let TypeORM manage the connections
    type: 'postgres',
    database: 'cerpo_test',
    host: 'localhost',
    username: 'develop',
    password: 'develop',
    port: 5432,
    entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    dropSchema: true,
    synchronize: true,
  });
}
