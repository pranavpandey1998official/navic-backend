import express, { Application, Request, Response } from 'express'
import WS from './websocket';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';


import trip from '@controller/trip';
import ride from '@controller/ride';
import route from '@controller/route';
import auth from '@controller/auth';
import user from '@controller/user';

import { PORT, MONGODB_URL } from '@utils/contants';
import createLogger from '@utils/logger';

const logger = createLogger('@app')

async function start() {
    const app: Application = express()
    app.use(bodyParser.json())
    app.use(cors());

    const server = app.listen(PORT, function () {
        logger.info(`App is listening on port ${PORT} !`)
    })
    await mongoose.connect(MONGODB_URL)
    logger.info("Connected to mongoDB")

    WS.initialize(server);
    
    app.use('/auth', auth)
    app.use('/trip', trip);
    app.use('/ride', ride);
    app.use('/route', route);
    app.use('/user', user);

    app.get('/ss', (req: Request, res: Response) => {
        res.send('Hello toto')
    })
}

start();

