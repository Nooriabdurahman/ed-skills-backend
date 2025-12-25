-- CreateTable
CREATE TABLE "public"."Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "icon" TEXT,
    "picture" TEXT,
    "materialType" TEXT NOT NULL,
    "materialCount" TEXT,
    "firstRecommendation" TEXT,
    "secondRecommendation" TEXT,
    "quizTotalScore" INTEGER,
    "quizPassingScore" INTEGER,
    "status" TEXT NOT NULL,
    "materialStatusType" TEXT NOT NULL,
    "isCertified" BOOLEAN NOT NULL DEFAULT false,
    "typeImage" TEXT,
    "progress" DOUBLE PRECISION,
    "duration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
