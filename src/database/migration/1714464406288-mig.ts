import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1714464406288 implements MigrationInterface {
    name = 'Mig1714464406288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nickname" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nickname" SET DEFAULT ''`);
    }

}
