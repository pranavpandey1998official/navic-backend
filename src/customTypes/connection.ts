import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
    userID?: string; 
    file?: Express.Multer.File
}
