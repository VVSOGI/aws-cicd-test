import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1714547313648 implements MigrationInterface {
    name = 'Mig1714547313648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" ADD "activityDate" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" ADD "activityTime" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "activityTime"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "activityDate"`);
    }

}
