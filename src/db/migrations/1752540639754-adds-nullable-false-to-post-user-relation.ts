import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsNullableFalseToPostUserRelation1752540639754
  implements MigrationInterface
{
  name = 'AddsNullableFalseToPostUserRelation1752540639754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" DROP CONSTRAINT "fk_post_id_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" ADD CONSTRAINT "fk_post_id_user_id" FOREIGN KEY ("user_id") REFERENCES "blog"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" DROP CONSTRAINT "fk_post_id_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."posts" ADD CONSTRAINT "fk_post_id_user_id" FOREIGN KEY ("user_id") REFERENCES "blog"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
