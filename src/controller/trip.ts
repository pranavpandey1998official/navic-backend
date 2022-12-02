
import {Response, Router} from 'express';
import { z } from 'zod';

import { deleteTrip, getTripFromUserID, insertTrip } from 'service/trip';
import createLogger from '@utils/logger';
import { Request } from '@customTypes/connection';
import { verifyToken } from '@middleware/auth';
import validateRequest from '@middleware/validateRequst';


var router = Router()
const logger = createLogger('@contoller/trip')

const SCHEMA = {
    START: z.object({
        direction: z.any(),
    }),
    END: z.object({
        tripID: z.string().min(1)
    }),
    RIDE_FROM_TRIP: z.object({
        tripID: z.string().min(1)
    })
}

// Started by driver
router.use(verifyToken);

router.post('/start',
    validateRequest({
        body: SCHEMA.START
    }), 
async function(req: Request, res, next) {
    const userID = req.userID!!
    const body: z.infer<typeof SCHEMA.START> = req.body
    try {
        const trip = await insertTrip(userID, body.direction)
        return res.send(trip)
    } catch(e) {
        next(e)
    }
})

router.post('/end', async function(req: Request, res: Response, next) {
    const userID = req.userID!!
    const body: z.infer<typeof SCHEMA.END> = req.body
    try {
        await deleteTrip(userID, body.tripID)
        return res.send({
            success: true
        })
    } catch(e) {
       next(e)
    }
})

router.get('/ongoing', async function(req: Request, res, next) {
    const userID = req.userID!!
    try {
        const trip = await getTripFromUserID(userID);
        return res.send(trip)
    } catch(e) {
        next(e)
    }
})


export default router;