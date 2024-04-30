import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1714469868086 implements MigrationInterface {
    name = 'Mig1714469868086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" ADD "imagePath" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "imagePath"`);
    }

}
