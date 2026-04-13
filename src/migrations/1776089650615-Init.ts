import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1776089650615 implements MigrationInterface {
  name = 'Init1776089650615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "base_custom_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_eca13ebd9d8e1563974ae307b14" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Test" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying(255) NOT NULL, CONSTRAINT "PK_257c543a36adff226a93de571a2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Test"`);
    await queryRunner.query(`DROP TABLE "base_custom_entity"`);
  }
}
