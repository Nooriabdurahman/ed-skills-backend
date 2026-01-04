import { Request, Response } from 'express';
import { AuthRequest } from '../../common/midlewere/authMiddlewere';
export declare const uploadProfilePicture: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProfile: (req: Request, res: Response) => Promise<void>;
export declare const getProfileByUser: (req: Request, res: Response) => Promise<Response | void>;
//# sourceMappingURL=profile-services.d.ts.map