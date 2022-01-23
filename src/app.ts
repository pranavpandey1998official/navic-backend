import express, { Application, Request, Response } from 'express'
import MQBroker from './data/MQBroker';
import WS from './websocket';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import trip from 'controller/trip';
import ride from 'controller/ride';
import route from 'controller/ride';
import user from 'controller/user';
import { MONGODB_URL, PORT } from 'utils/contants';

async function start() {
    const app: Application = express()
    app.use(bodyParser.json())

    console.log('connected to mongoDB')

    const server = app.listen(PORT, function () {
        console.log(`App is listening on port ${PORT} !`)
    })

    WS.initialize(server);

    app.use('/trip', trip);
    app.use('/ride', ride);
    app.use('route', route);
    app.use('user', user);

    app.get('/ss', (req: Request, res: Response) => {
        res.send('Hello toto')
    })
}

start();

