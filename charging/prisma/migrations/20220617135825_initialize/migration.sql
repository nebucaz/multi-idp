/*
  Warnings:

  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sub" TEXT NOT NULL,
    "iss" TEXT NOT NULL,
    "tncTimestamp" INTEGER NOT NULL DEFAULT 0,
    "evidenceTimestamp" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("sub", "iss")
);
INSERT INTO "new_User" ("createdAt", "email", "evidenceTimestamp", "iss", "name", "sub", "tncTimestamp", "username") SELECT "createdAt", "email", "evidenceTimestamp", "iss", "name", "sub", "tncTimestamp", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
