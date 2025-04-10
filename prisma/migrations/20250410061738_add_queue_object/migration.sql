-- CreateTable
CREATE TABLE "QueuePosition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "QueuePosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueuePosition" ADD CONSTRAINT "QueuePosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
