import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776061529585 implements MigrationInterface {
    name = 'Init1776061529585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_custom_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_eca13ebd9d8e1563974ae307b14" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "base_custom_entity"`);
    }

}
