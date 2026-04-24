import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776954196503 implements MigrationInterface {
    name = 'Init1776954196503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_3d48d13b4578bccfbda468b1c4" ON "Posts" ("blogId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3d48d13b4578bccfbda468b1c4"`);
    }

}
