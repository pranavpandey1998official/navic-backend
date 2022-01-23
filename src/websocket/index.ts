import * as WebSocket from 'ws';
import http, { Server } from 'http'
import WSConnection from './WSConnection';
import { split } from 'lodash'

class WS { 
    static instance: WS;
    wss: WebSocket.Server;

    constructor(server: Server) {
        this.wss = new WebSocket.Server({ server, path: '/ws'})
        this.wss.on('connection', this.onConnection)
    }

    async onConnection(ws: WebSocket, request: http.IncomingMessage) {

        if(!request.url) {
            ws.close(400, 'Bad request')
            return;
        }
        const userId = split(request.url, 'userId=', 2)[1]
        
        if(!userId) {
            ws.close(400, 'userId not present');
            return;
        }

        new WSConnection(ws, userId);
    }

    static initialize(server: Server) {
        if(!WS.instance) {
            WS.instance = new WS(server)
        }
        return WS.instance
    }
}

export default WS;
