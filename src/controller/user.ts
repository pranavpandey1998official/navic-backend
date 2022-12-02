import { Router, Response, NextFunction, response } from 'express';
import z from 'zod';
import multer from 'multer';


import { checkUserRefreshToken, createUser, getUserFromID, getUserFromPhoneNumber, removeRefeshToken, removeTokens, updateAuthToken, updateCompanionPreference, updateImageURL, updateTokens, uploadProfilePhoto } from 'service/user';
import { Request, } from '@customTypes/connection';
import { verifyToken } from '@middleware/auth';
import { createAuthToken, createRefreshToken, decodeAuthToken, decodeRefreshToken } from 'service/jwt';
import { ERRORS, RequestError } from '@utils/error';
import validateRequest from '@middleware/validateRequst';
import { getPhoneOTP, setPhoneOTP } from 'service/redis';

var router = Router();
const inMemoryStorage = multer.memoryStorage()
const upload = multer({ storage: inMemoryStorage })

const SCHEMA = {
    VERIFY_SIGNUP: z.object({
                    phoneNumber: z.string().min(1),
    }),
    RESEND_OTP: z.object({
        phoneNumber: z.string().min(1),
    }),
    VERIFY_LOGIN: z.object({
        phoneNumber: z.string().min(1),
    }),
    LOGIN: z.object({
                phoneNumber: z.string().min(1),
            }),
    
    SIGNUP: z.object({
        otp: z.string().min(4),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phoneNumber: z.string().min(1),
        gender: z.enum(["MALE", "FEMALE"])
    }),
    REFRESH_TOKEN: z.object({
        refreshToken:  z.string().min(1)
    }),
    AUTH_TOKEN: z.object({
        authToken:  z.string().min(1)
    }),
    LOGOUT_FROM_ALL_DEVICES: z.object({
        phoneNumber: z.string().min(1),
    }),
    GET_USER: z.object({
        userID: z.string().min(1),
    }),
    COMPANION_PREFERENCE: z.object({
        companionPreference: z.string().min(1)
    })
    
}

router.get('/', verifyToken, 
async function(req: Request, res: Response, next: NextFunction) {
    const userID = req.userID!!
    try {
        const user = await getUserFromID(userID)
        res.send({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            imageURL: user.imageURL
        })
    } catch(e) {
        next(e)
    }
})

function getStrippedUser(user: any) {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        imageURL: user.imageURL,
        companionPreference: user.companionPreference
    }
}

router.get('/info', verifyToken,
validateRequest({
    query: SCHEMA.GET_USER
}), 
async function(req: Request, res: Response, next: NextFunction) {
    const query: z.infer<typeof SCHEMA.GET_USER> = req.query as z.infer<typeof SCHEMA.GET_USER>
    try {
        const user = await getUserFromID(query.userID)
        res.send(getStrippedUser(user))
    } catch(e) {
        next(e)
    }
})

router.get('/', verifyToken, 
async function(req: Request, res: Response, next: NextFunction) {
    const userID = req.userID!!
    try {
        const user = await getUserFromID(userID)
        res.send(getStrippedUser(user))
    } catch(e) {
        next(e)
    }
})


router.get('/authToken',
    validateRequest({
        body: SCHEMA.AUTH_TOKEN
    }),
    async function (req: Request, res: Response, next: NextFunction) {
        const body: z.infer<typeof SCHEMA.AUTH_TOKEN> = req.body
        try {
            const token = decodeAuthToken(body.authToken)
            res.send({
                verify: true
            })
        }catch(e) {
            next(e)
        }
    }
)

router.post('/logout', verifyToken, 
async function(req: Request, res: Response, next: NextFunction) {
    const userID = req.userID!!
    try {
        const user = await removeTokens(userID)
        res.send(true)
    } catch(e) {
        next(e)
    }
})

router.post('/refreshToken', 
    validateRequest({
        body: SCHEMA.REFRESH_TOKEN
    }),
    async function (req: Request, res: Response, next: NextFunction) {
        const body: z.infer<typeof SCHEMA.REFRESH_TOKEN> = req.body
        try {
            const token = decodeRefreshToken(body.refreshToken)
            const userID: string = token.id
            const user = await checkUserRefreshToken(userID, body.refreshToken)
            const authToken =  createAuthToken({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                phoneNumber: user.phoneNumber
            })
            updateAuthToken(userID, authToken)
            res.send({
                authToken: authToken
            })

        } catch(e) {
            next(ERRORS.INVALID_REFRESH_TOKEN)
        }
    }
)

router.get('/verifyLogin',
    validateRequest({
        query: SCHEMA.VERIFY_LOGIN
    }),
    async function (req: Request, res: Response, next: NextFunction) {
        const query: z.infer<typeof SCHEMA.VERIFY_LOGIN> = req.query as z.infer<typeof SCHEMA.VERIFY_LOGIN>
        try {
            const user = await getUserFromPhoneNumber(query.phoneNumber)
            res.send({
                verify: true
            })
            return;
            // We are not checking for another user loggedin here
        } catch(e) {
            next(e)
        }
    }
)

router.post('/login', 
    validateRequest({
        body: SCHEMA.LOGIN
    }),
    async function (req: Request, res: Response, next: NextFunction) {
        const body: z.infer<typeof SCHEMA.LOGIN> = req.body
        try {
            const user = await getUserFromPhoneNumber(body.phoneNumber)
            try {
                const a = decodeAuthToken(user.authToken.toString());
                next(ERRORS.ANOTHER_USER_LOGGEDIN)
            } catch(e) {
                const authToken =  createAuthToken({
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    phoneNumber: user.phoneNumber
                })
                const refreshToken = createRefreshToken({
                    id: user._id,
                })
                await updateTokens(user._id, authToken, refreshToken)
                res.send({
                    user: getStrippedUser(user),
                    refreshToken,
                    authToken
                })
            }
        } catch(e) {
            next(e)
        }
    }
)

router.post('/verifySignup',
    validateRequest({
        body: SCHEMA.VERIFY_SIGNUP
    }),
    async function (req: Request, res: Response, next: NextFunction) {
        const body: z.infer<typeof SCHEMA.VERIFY_SIGNUP> = req.body
        try {
            const user = await getUserFromPhoneNumber(body.phoneNumber)
            next(ERRORS.ANOTHER_USER_EXISTS)
        } catch(e) {
            if(e instanceof RequestError && e.code === ERRORS.CANNOT_FIND_USER.code) {
                await setPhoneOTP(body.phoneNumber, "1234")
                res.send({
                    verify: true
                })
                return;
            }
            next(ERRORS.DATABASE_ERROR)
        }
    }
)

router.post('/resendOTP',
    validateRequest({
        body: SCHEMA.RESEND_OTP
    }),
    async function (req: Request, res: Response, next: NextFunction) {
        const body: z.infer<typeof SCHEMA.RESEND_OTP> = req.body
        await setPhoneOTP(body.phoneNumber, "1234")
        res.send({
            verify: true
        })
        return;
    }
)

router.post('/signup',
    validateRequest({
        body: SCHEMA.SIGNUP
    }),
    async function (req: Request, res, next) {
        const body: z.infer<typeof SCHEMA.SIGNUP> = req.body
        try {
            const otp = await getPhoneOTP(body.phoneNumber)
            console.log(body)
            if(body.otp != otp) {
                throw ERRORS.INVALID_OTP
            }
            let user = await createUser(body.firstName, body.lastName, body.phoneNumber, body.gender);
            const authToken =  createAuthToken({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                phoneNumber: user.phoneNumber
            })
            const refreshToken = createRefreshToken({
                id: user._id,
            })
            await updateTokens(user._id, authToken, refreshToken)
            res.send({
                user: getStrippedUser(user),
                refreshToken,
                authToken
            })
        } catch(e) {
            next(e)
        }
    }
)

router.post('/logoutFromOtherDevices', 
validateRequest({
    body: SCHEMA.LOGOUT_FROM_ALL_DEVICES
}),
async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.LOGOUT_FROM_ALL_DEVICES> = req.body
    try {
        const user = await getUserFromPhoneNumber(body.phoneNumber)
        await removeRefeshToken(user._id)
        res.send(true)
    } catch(e) {
        next(e)
    }
})

router.post('/updateCompanionPreference',
    verifyToken,
    validateRequest({
        body: SCHEMA.COMPANION_PREFERENCE
    }),
   async (req: Request, res: Response, next) => {
        const userID = req.userID!!
        const body: z.infer<typeof SCHEMA.COMPANION_PREFERENCE> = req.body
        console.log(req.body)
        try {
            const user = await updateCompanionPreference(userID, body.companionPreference)
            res.send(getStrippedUser(user))
        } catch(e) {
            next(e)
        }
   }
)

router.post('/updateProfilePhoto', upload.single('image'), verifyToken,
 async function (req: Request, res: Response, next) {
    if(!req.file) {
        return next(ERRORS.FILE_NOT_FOUND)
    }
    const userID = req.userID!!
    try {
        const url = await uploadProfilePhoto(req.file, userID)
        await updateImageURL(userID, url)
        res.send({
            imageURL: url,
        })
    } catch(e) {
        next(e)
    }
})

router.get('/profilePhoto', async function (req: Request, res: Response) {
    
})

export default router;