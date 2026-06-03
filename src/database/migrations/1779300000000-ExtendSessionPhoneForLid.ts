import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendSessionPhoneForLid1779300000000 implements MigrationInterface {
  name = 'ExtendSessionPhoneForLid1779300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isPostgres = queryRunner.connection.options.type === 'postgres';

    if (isPostgres) {
      await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "phone" TYPE varchar(50)`);
    } else {
      // SQLite does not support ALTER COLUMN — recreate the table
      await queryRunner.query(
        `CREATE TABLE "sessions_new" (
          "id" varchar PRIMARY KEY NOT NULL,
          "name" varchar(100) NOT NULL,
          "status" varchar(50) NOT NULL DEFAULT ('created'),
          "phone" varchar(50),
          "pushName" varchar(100),
          "config" text NOT NULL DEFAULT ('{}'),
          "proxyUrl" varchar(255),
          "proxyType" varchar(10),
          "connectedAt" datetime,
          "lastActiveAt" datetime,
          "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
          "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
          CONSTRAINT "UQ_ac984ccbd8b01af155e1874e8cb" UNIQUE ("name")
        )`,
      );
      await queryRunner.query(
        `INSERT INTO "sessions_new" SELECT "id","name","status","phone","pushName","config","proxyUrl","proxyType","connectedAt","lastActiveAt","createdAt","updatedAt" FROM "sessions"`,
      );
      await queryRunner.query(`DROP TABLE "sessions"`);
      await queryRunner.query(`ALTER TABLE "sessions_new" RENAME TO "sessions"`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isPostgres = queryRunner.connection.options.type === 'postgres';

    if (isPostgres) {
      await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "phone" TYPE varchar(20)`);
    } else {
      await queryRunner.query(
        `CREATE TABLE "sessions_new" (
          "id" varchar PRIMARY KEY NOT NULL,
          "name" varchar(100) NOT NULL,
          "status" varchar(50) NOT NULL DEFAULT ('created'),
          "phone" varchar(20),
          "pushName" varchar(100),
          "config" text NOT NULL DEFAULT ('{}'),
          "proxyUrl" varchar(255),
          "proxyType" varchar(10),
          "connectedAt" datetime,
          "lastActiveAt" datetime,
          "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
          "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
          CONSTRAINT "UQ_ac984ccbd8b01af155e1874e8cb" UNIQUE ("name")
        )`,
      );
      await queryRunner.query(
        `INSERT INTO "sessions_new" SELECT "id","name","status","phone","pushName","config","proxyUrl","proxyType","connectedAt","lastActiveAt","createdAt","updatedAt" FROM "sessions"`,
      );
      await queryRunner.query(`DROP TABLE "sessions"`);
      await queryRunner.query(`ALTER TABLE "sessions_new" RENAME TO "sessions"`);
    }
  }
}
