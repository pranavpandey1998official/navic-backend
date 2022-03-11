
import {Router} from 'express';

import { deleteTrip, getTrip, insertTrip } from 'service/trip';
import createLogger from '@utils/logger';
import { Request } from '@customTypes/connection';
import { verifyToken } from '@middleware/auth';

var router = Router()
const logger = createLogger('@contoller/trip')

// Started by driver
router.use(verifyToken);

router.post('/start', async function(req: Request, res) {
    const direction = req.body
    const userID = req.userID
    if(!userID) {
        logger.warn("userID is not found /start")
        return res.status(500).send("")
    }
    try {
        const trip = await insertTrip(userID, direction)
        return res.send(trip)
    } catch(e) {
        logger.error(e)
        return res.status(421).send("Cannot create")
    }
})

router.post('/end', async function(req: Request, res) {
    const tripID = req.body
    const userID = req.userID
    if(!userID) {
        logger.warn("userID is not found /end")
        return res.status(500).send("")
    }
    try {
        await deleteTrip(userID, tripID)
        return res.send(true)
    } catch(e) {
        logger.error(e)
        return res.status(409).send("Cannot delete")
    }
})

router.get('/ongoing', async function(req: Request, res) {
    const userID = req.userID
    if(!userID) {
        logger.warn("userID is not found /ongoing")
        return res.status(500).send("")
    }
    try {
        const trip = await getTrip(userID);
        if(trip) {
            return res.send(trip)
        }
        return res.status(404).send("No ongoing trip found")
    } catch(e) {
        res.status(500).send("Internal Server error")
    }
})


export default router;