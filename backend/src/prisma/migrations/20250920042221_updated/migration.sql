/*
  Warnings:

  - You are about to drop the column `email` on the `Visitor` table. All the data in the column will be lost.
  - You are about to drop the column `visit_reason` on the `Visitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Visitor" DROP COLUMN "email",
DROP COLUMN "visit_reason";
