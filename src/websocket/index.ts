import * as WebSocket from 'ws';
import http, { Server } from 'http'

import WSConnection from './WSConnection';

import { decode } from '@middleware/auth';
import { Request } from '@customTypes/connection';
import user from 'data/models/user';

class WS { 
    static instance: WS;
    wss: WebSocket.Server;

    constructor(server: Server) {
        this.wss = new WebSocket.Server({ noServer: true, path: '/ws'})
        server.on('upgrade', this.upgrade)
        this.wss.on('connection', this.onConnection)
    }

    upgrade = async (req: any, socket: any, head: any) => {
        // This function is not defined on purpose. Implement it with your own logic.
        let token = req.headers["x-access-token"] as string;
        
        try {
            const decoded = await decode(token)
            req.userID = decoded.id

            if (!req.userID) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }
            this.wss.handleUpgrade(req, socket, head, (ws) => {
                this.wss.emit('connection', ws, req);
            });
        } catch(e) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
            socket.destroy();
            return;
        }
    }

    async onConnection(ws: WebSocket, request: Request) {

        if(!request.url) {
            ws.close(400, 'Bad request')
            return;
        }
        const userID = request.userID
        console.log(userID, "websocket connected")
        if(!userID) {
            ws.close(4001, 'cannot authenticate');
            return;
        }

        new WSConnection(ws, userID);
    }

    static initialize(server: Server) {
        if(!WS.instance) {
            WS.instance = new WS(server)
        }
        return WS.instance
    }
}

export default WS;
