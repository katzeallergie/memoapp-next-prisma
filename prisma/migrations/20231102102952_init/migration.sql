-- CreateTable
CREATE TABLE "memos" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memos_pkey" PRIMARY KEY ("id")
);
