import { MigrationInterface, QueryRunner } from 'typeorm';
import { randomBytes } from 'crypto';

export class Mig1714462856753 implements MigrationInterface {
  name = 'Mig1714462856753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "nickname" varchar(40) NOT NULL DEFAULT ''`,
    );

    // 모든 유저 레코드를 가져옴
    const users = await queryRunner.query(`SELECT "id" FROM "user"`);

    // 각 유저마다 고유한 닉네임 생성 및 업데이트
    for (const user of users) {
      const hexString = randomBytes(8).toString('hex'); // 16바이트의 랜덤 16진수 생성
      const nickname = `@user-${hexString}`;
      await queryRunner.query(
        `UPDATE "user" SET "nickname" = $1 WHERE "id" = $2`,
        [nickname, user.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nickname"`);
  }
}
