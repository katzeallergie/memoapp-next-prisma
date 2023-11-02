/*
  Warnings:

  - You are about to drop the column `title` on the `memos` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_memos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_memos" ("content", "createdAt", "id") SELECT "content", "createdAt", "id" FROM "memos";
DROP TABLE "memos";
ALTER TABLE "new_memos" RENAME TO "memos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
