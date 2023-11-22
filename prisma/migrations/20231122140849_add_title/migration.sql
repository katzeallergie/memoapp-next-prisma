/*
  Warnings:

  - Added the required column `title` to the `memos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "memos" ADD COLUMN     "title" TEXT NOT NULL;
