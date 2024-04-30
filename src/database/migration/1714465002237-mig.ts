import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1714465002237 implements MigrationInterface {
    name = 'Mig1714465002237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "commitUrl"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE "public"."board_priority_enum"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "likeNumber" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "likeNumber"`);
        await queryRunner.query(`CREATE TYPE "public"."board_priority_enum" AS ENUM('high', 'low')`);
        await queryRunner.query(`ALTER TABLE "board" ADD "priority" "public"."board_priority_enum" NOT NULL DEFAULT 'low'`);
        await queryRunner.query(`ALTER TABLE "board" ADD "commitUrl" character varying(255) NOT NULL`);
    }

}
