import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPostRelation1750726506664 implements MigrationInterface {
  name = 'CreateUserPostRelation1750726506664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" ADD "user_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" ADD CONSTRAINT "fk_post_id_user_id" FOREIGN KEY ("user_id") REFERENCES "blog"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" DROP CONSTRAINT "fk_post_id_user_id"`,
    );
    await queryRunner.query(`ALTER TABLE "blog"."posts" DROP COLUMN "user_id"`);
  }
}
