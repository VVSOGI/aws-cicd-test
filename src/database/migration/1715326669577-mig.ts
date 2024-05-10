import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1715326669577 implements MigrationInterface {
    name = 'Mig1715326669577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImage"`);
    }

}
