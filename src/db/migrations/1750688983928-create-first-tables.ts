import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFirstTables1750688983928 implements MigrationInterface {
  name = 'CreateFirstTables1750688983928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blog"."posts" ("created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "internal_comment" character varying(300), "metadata" jsonb, "id" character varying NOT NULL DEFAULT generate_ulid('pst'), "title" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "pk_post_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_posts_created_at" ON "blog"."posts" ("created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_posts_deleted_at" ON "blog"."posts" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "blog"."users" ("created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "internal_comment" character varying(300), "metadata" jsonb, "fsm_events" jsonb, "id" character varying NOT NULL DEFAULT generate_ulid('usr'), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL DEFAULT '{"PENDING":"PENDING","ACTIVATED":"ACTIVATED","INACTIVATED":"INACTIVATED"}', "role" character varying NOT NULL DEFAULT 'STUDENT', CONSTRAINT "uq_users_email" UNIQUE ("email"), CONSTRAINT "chk_user_status_ef1e93353313f52cb465119e2b27c5ea17a6d2f2" CHECK (status IN ('PENDING','ACTIVATED','INACTIVATED')), CONSTRAINT "pk_user_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_created_at" ON "blog"."users" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_deleted_at" ON "blog"."users" ("deleted_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "blog"."idx_users_deleted_at"`);
    await queryRunner.query(`DROP INDEX "blog"."idx_users_created_at"`);
    await queryRunner.query(`DROP TABLE "blog"."users"`);
    await queryRunner.query(`DROP INDEX "blog"."idx_posts_deleted_at"`);
    await queryRunner.query(`DROP INDEX "blog"."idx_posts_created_at"`);
    await queryRunner.query(`DROP TABLE "blog"."posts"`);
  }
}
