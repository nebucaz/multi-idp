/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL,
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
INSERT INTO "new_User" ("evidenceTimestamp", "id", "iss", "sub", "tncTimestamp", "username") SELECT "evidenceTimestamp", "id", "iss", "sub", "tncTimestamp", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
