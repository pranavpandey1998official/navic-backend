import WebSocket from 'ws';
import Redis from 'ioredis';
import Message, { Message_Location_Update, Message_Request_Ride } from '../customTypes/message'
import { MESSAGE_TYPE, CHANNEL, QUEUE, REQEST_TIMEOUT, LOCATION_HASH } from './utils/constants';
import { encodeMessage, decodeMessage } from './utils/helper';

class WSConnection {
    ws: WebSocket;
    userId: string;
    redis: Redis.Redis;
    rChannelLisner: Redis.Redis;
    mqListner: Redis.Redis;

    constructor(ws: WebSocket, userId: string) {
        this.ws = ws;
        this.userId = userId
        this.redis = new Redis();
        this.rChannelLisner = new Redis();
        this.mqListner = new Redis();
        this.consume()
        ws.on('message', this.onMessage)
    }

    consume() {
        this.mqListner.blpop(`${QUEUE.MESSAGE}:${this.userId}`, 0).then((message) => {
            console.log(message)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
            this.consume()
        })
    }
    
    onMessage = (data: Buffer) => {
        const message = decodeMessage(data)

        if(typeof message === 'string') {
            console.log(message)
            return;
        }
        switch(message.type) {
            case MESSAGE_TYPE.LOCATION_UPDATE:
                this.handleLocationUpdate(message)
                break;
            
            case MESSAGE_TYPE.RIDER_REQUEST_RIDE:
                this.handleRiderRequestRide(message)
                break;
            
            // case MESSAGE_TYPE.DRIVER_ACCEPT_RIDE:
            //     break;
            // case MESSAGE_TYPE.DRIVER_REJECT_RIDE:
            //     break;
            // case MESSAGE_TYPE.RIDER_SYNACK_RIDE:
            //     break;
            default:
                console.log(`${message} not supported`)
        }   
    }

    handleLocationUpdate = (message: Message_Location_Update) => {
        this.redis.publish(`${CHANNEL.LOCATION}:${this.userId}`, JSON.stringify(message))
        this.redis.hset(LOCATION_HASH, this.userId ,JSON.stringify(message))
    }

    handleRiderRequestRide = (message: Message_Request_Ride) => {
        if(message.requestTS< Date.now() - REQEST_TIMEOUT) {
            return
            // maybe console log that the messge was timedout
        }
        this.redis.rpush(`${QUEUE.MESSAGE}:${message.driverId}`, encodeMessage(message))
    }

}

export default WSConnection;