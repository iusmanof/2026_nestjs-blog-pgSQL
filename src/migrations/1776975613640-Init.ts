import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776975613640 implements MigrationInterface {
    name = 'Init1776975613640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostLikes" DROP CONSTRAINT "UQ_1f659985c01b77d1a69c7a81b30"`);
        await queryRunner.query(`CREATE INDEX "IDX_3736211d3128b56b16faf98b44" ON "Posts" ("blogId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f659985c01b77d1a69c7a81b3" ON "PostLikes" ("userId", "postId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1f659985c01b77d1a69c7a81b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3736211d3128b56b16faf98b44"`);
        await queryRunner.query(`ALTER TABLE "PostLikes" ADD CONSTRAINT "UQ_1f659985c01b77d1a69c7a81b30" UNIQUE ("postId", "userId")`);
    }

}
