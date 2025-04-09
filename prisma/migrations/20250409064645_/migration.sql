/*
  Warnings:

  - You are about to drop the column `hasVoted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasVoted",
ADD COLUMN     "currentVoteId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentVoteId_fkey" FOREIGN KEY ("currentVoteId") REFERENCES "Vote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
