import { createConnection } from 'typeorm';

export async function createMemDB(entities) {
  return createConnection({
    // name, // let TypeORM manage the connections
    type: 'postgres',
    database: 'cerpo_test',
    host: 'localhost',
    username: 'develop',
    password: 'develop',
    port: 5432,
    entities,
    dropSchema: true,
    synchronize: true,
  });
}
