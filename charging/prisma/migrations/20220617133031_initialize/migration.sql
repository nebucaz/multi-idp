-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "iss" TEXT NOT NULL,
    "tncTimestamp" INTEGER NOT NULL,
    "evidenceTimestamp" INTEGER NOT NULL
);
