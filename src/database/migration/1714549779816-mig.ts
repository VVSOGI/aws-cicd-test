import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1714549779816 implements MigrationInterface {
    name = 'Mig1714549779816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" ADD "address" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "address"`);
    }

}
