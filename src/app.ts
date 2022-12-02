import express, { Application, Request, Response } from 'express'
import WS from './websocket';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';


import trip from '@controller/trip';
import ride from '@controller/ride';
import route from '@controller/route';
import auth from '@controller/auth';
import user from '@controller/user';

import { PORT, MONGODB_URL } from '@utils/contants';
import createLogger from '@utils/logger';
import { errorHandler } from '@middleware/error';
import axios from 'axios';
import { ERRORS } from '@utils/error';

const logger = createLogger('@app')

async function start() {
    const app: Application = express()
    app.use(bodyParser.json())
    app.use(cors());
    await mongoose.connect(MONGODB_URL)
    logger.info("Connected to mongoDB")

    app.use(morgan('combined'))
    app.use('/auth', auth)
    app.use('/trip', trip);
    app.use('/ride', ride);
    app.use('/route', route);
    app.use('/user', user);
    app.use(errorHandler)
    app.get('/checkForAvailability', async (req: Request, res: Response, next) => {
        res.send({
            available: false,
            reason: "Our services are not available at night"
        })
        // try {
        //     const timeResponse = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
        //     const date  = new Date(timeResponse.data.datetime)
        //     const hour = date.getHours;
        //     res.send({
        //         success: false
        //     })
        //     return;
        // } catch(e) {
        //     next(ERRORS.CONNOT_DETERMINE_TIME)
        // }
    })

    app.get('/ss', (req: Request, res: Response) => {
        res.send('Hello toto')
    })
    const server = app.listen(PORT, function () {
        logger.info(`App is listening on port ${PORT} !`)
    })
    WS.initialize(server);
}

start();

