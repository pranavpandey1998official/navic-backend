
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_AUTH_SECRET} from "@utils/contants"
import { Response, NextFunction, RequestHandler } from 'express';
import { Request } from '@customTypes/connection';
import { ERRORS } from '@utils/error';

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["x-access-token"] as string;
  
    if (!token) {
      next(ERRORS.AUTH_NO_TOKEN_FOUND)
      return;
    }
  
    jwt.verify(token, JWT_AUTH_SECRET, (err, decoded) => {
      if (err || !decoded) {
        next(ERRORS.AUTH_UNAUTHERISED);
        return;
      }
      // @ts-ignore
      req.userID = decoded.id;
      next();
    });
  };

export function decode(token: string): Promise<JwtPayload> {
  return new Promise(function(resolve, reject) {
      try {
        const dec =jwt.verify(token, JWT_AUTH_SECRET);
        if(typeof dec == 'string') {
          reject("We got an string as decoded");
          return;
        }
        resolve(dec);
      } catch(e) {
        reject(e)
      }
  })
}
