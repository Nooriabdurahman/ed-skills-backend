export interface CreateLessonResourceDto {
  name: string;
  description?: string;
  lessonId: string;
  fileType?: string;
  fileSize?: number;
}

