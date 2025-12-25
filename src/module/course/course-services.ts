import prisma from '../../common/config/database/prisma';

export const createCourse = async (data: any) => {
  return prisma.course.create({ data });
};

export const getAllCourses = async () => {
  return prisma.course.findMany();
};

export const getCourseById = async (id: number) => {
  return prisma.course.findUnique({ where: { id } });
};

export const updateCourse = async (id: number, data: any) => {
  return prisma.course.update({ where: { id }, data });
};

export const deleteCourse = async (id: number) => {
  return prisma.course.delete({ where: { id } });
};
