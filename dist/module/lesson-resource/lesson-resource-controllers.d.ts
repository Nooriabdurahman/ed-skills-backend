import { Request, Response } from "express";
export declare class LessonResourceController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getByLesson(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=lesson-resource-controllers.d.ts.map