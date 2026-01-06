-- CreateTable
CREATE TABLE "public"."CourseHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseHistory_userId_idx" ON "public"."CourseHistory"("userId");

-- CreateIndex
CREATE INDEX "CourseHistory_courseId_idx" ON "public"."CourseHistory"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseHistory_userId_courseId_key" ON "public"."CourseHistory"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."CourseHistory" ADD CONSTRAINT "CourseHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseHistory" ADD CONSTRAINT "CourseHistory_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
