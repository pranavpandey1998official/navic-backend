import {Router} from 'express';
import z from 'zod';

import { verifyToken } from '@middleware/auth';
import createLogger from '@utils/logger';
import validateRequest from '@middleware/validateRequst';
import { Request } from '@customTypes/connection';
import { deleteRideFromID, getRideFromUserID, insertRide, getRideFromTripID } from 'service/ride';
import { ERRORS } from '@utils/error';


var router = Router()
const logger = createLogger('@contoller/ride')

// Taken by passenger
const SCHEMA = {
    START: z.object({
        driverID: z.string().min(1),
        riderID: z.string().min(1),
        tripID: z.string().min(1),
        cost: z.number(),
        direction: z.any(),
    }),
    DRIVER_END: z.object({
        rideID: z.string().min(1)
    }),
    RIDER_END: z.object({
        rideID: z.string().min(1)
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
    async function (req: Request, res, next) {
        const userID = req.userID!!
        const body: z.infer<typeof SCHEMA.START> = req.body
        try {
            if(userID != body.driverID) {
                throw ERRORS.CANNOT_START_RIDE_FROM_ANOTHER_DRIVER
            }
            const ride = await insertRide(body.riderID, body.tripID, body.direction, body.cost, body.driverID)
            return res.send(ride)
        } catch(e) {
            next(e)
        }
    }
)

router.post('/stop',
    validateRequest({
        body: SCHEMA.RIDER_END
    }),
    async function(req: Request, res, next) {
        try {
            const body: z.infer<typeof SCHEMA.DRIVER_END> = req.body
            await deleteRideFromID(body.rideID)
            return res.send(true)
        } catch(e) {
            next(e)
        }
    }
)

router.get('/ongoing', async function(req: Request, res, next) {
        const userID = req.userID!!
        try {
            const ride = await getRideFromUserID(userID);
            return res.send(ride)
        } catch(e) {
            next(e)
        }
    }
)

router.get('/fromTrip',
    validateRequest({
        query: SCHEMA.RIDE_FROM_TRIP
    }),
    async function(req: Request, res, next) {
        const userID = req.userID!!
        const query: z.infer<typeof SCHEMA.RIDE_FROM_TRIP> = req.query as z.infer<typeof SCHEMA.RIDE_FROM_TRIP>
        try {
            const ride = await getRideFromTripID(query.tripID)
            return res.send(ride)
        } catch(e) {
            next(e)
        }

    }
)

export default router;