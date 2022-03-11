
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_SECRET} from "@utils/contants"
import { Response, NextFunction, RequestHandler } from 'express';
import { Request } from '@customTypes/connection';

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["x-access-token"] as string;
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      // @ts-ignore
      req.userID = decoded.id;
      next();
    });
  };

export function decode(token: string): Promise<JwtPayload> {
  return new Promise(function(resolve, reject) {
      try {
        const dec =jwt.verify(token, JWT_SECRET);
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
