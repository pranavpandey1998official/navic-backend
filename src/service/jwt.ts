import { JWT_AUTH_SECRET, JWT_AUTH_EXPIRATION, JWT_REFRESH_SECRET } from '@utils/contants';
import { ERRORS } from '@utils/error';
import { User } from 'data/models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function createAuthToken(user: Object) {
    const token = jwt.sign(user, JWT_AUTH_SECRET,
            { expiresIn: JWT_AUTH_EXPIRATION }
        )
    return token;
}

export function createRefreshToken(user: Object) {
    const token = jwt.sign(user, JWT_REFRESH_SECRET) // Refresh token never expires
    return token
}

export function decodeAuthToken(token: string) {
    const dec  = jwt.verify(token, JWT_AUTH_SECRET)
    if(typeof dec == 'string') {
        throw ERRORS.INVALID_AUTH_TOKEN;
    }
    return dec
}

export function decodeRefreshToken(token: string) {
    const dec = jwt.verify(token, JWT_REFRESH_SECRET)
    if(typeof dec == 'string') {
        throw ERRORS.INVALID_REFRESH_TOKEN
    }
    return dec
}
