import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1707118760019 implements MigrationInterface {
    name = 'Mig1707118760019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying(255) NOT NULL, "email" character varying(40) NOT NULL, "password" character varying NOT NULL, "permission" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."board_priority_enum" AS ENUM('high', 'low')`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" character varying NOT NULL, "commitUrl" character varying(255) NOT NULL, "priority" "public"."board_priority_enum" NOT NULL DEFAULT 'low', "email" character varying(255) NOT NULL, "userId" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_c9951f13af7909d37c0e2aec484" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_c9951f13af7909d37c0e2aec484"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TYPE "public"."board_priority_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
