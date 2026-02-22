import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// RFC вынести в ENV
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass',
      database: 'pg-db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
  ],
})
export class PostgresqlDatabaseModule {}
