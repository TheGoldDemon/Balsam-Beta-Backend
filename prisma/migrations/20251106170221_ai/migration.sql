-- CreateTable
CREATE TABLE "UserChat" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMemory" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Summary" TEXT NOT NULL,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMemory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMemory_UserId_key" ON "UserMemory"("UserId");
