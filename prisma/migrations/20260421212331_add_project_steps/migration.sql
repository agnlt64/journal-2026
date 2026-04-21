-- CreateTable
CREATE TABLE "ProjectStep" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),
    "completionComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectStep_projectId_order_idx" ON "ProjectStep"("projectId", "order");

-- AddForeignKey
ALTER TABLE "ProjectStep" ADD CONSTRAINT "ProjectStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
