/*
  Warnings:

  - You are about to drop the column `isLocked` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `blurLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `itemsPerPage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pinCodeHash` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "isLocked";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blurLevel",
DROP COLUMN "itemsPerPage",
DROP COLUMN "pinCodeHash";
