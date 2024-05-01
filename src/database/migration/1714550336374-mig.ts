import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1714550336374 implements MigrationInterface {
    name = 'Mig1714550336374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "activityDate"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "activityDate" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "activityTime"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "activityTime" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "activityTime"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "activityTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "activityDate"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "activityDate" character varying NOT NULL`);
    }

}
