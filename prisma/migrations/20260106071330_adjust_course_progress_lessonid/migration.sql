-- AlterTable
ALTER TABLE "public"."CourseProgress" ALTER COLUMN "lessonId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."CourseProgress" ADD CONSTRAINT "CourseProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."CourseLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
