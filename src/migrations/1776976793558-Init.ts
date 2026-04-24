import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776976793558 implements MigrationInterface {
    name = 'Init1776976793558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3d48d13b4578bccfbda468b1c4"`);
        await queryRunner.query(`CREATE INDEX "IDX_3456d08db394b9706ca422db1f" ON "Blogs" ("createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3456d08db394b9706ca422db1f"`);
        await queryRunner.query(`CREATE INDEX "IDX_3d48d13b4578bccfbda468b1c4" ON "Posts" ("blogId") `);
    }

}
