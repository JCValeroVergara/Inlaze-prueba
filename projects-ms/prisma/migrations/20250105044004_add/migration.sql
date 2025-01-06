/*
  Warnings:

  - You are about to drop the column `completed` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "completed",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
