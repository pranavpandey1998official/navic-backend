import WebSocket from 'ws';
import Redis from 'ioredis';
import Message, { Message_Location_Update, Message_Request_Ride, Message_ride_request_accept, Message_ride_request_reject, Message_ride_stop, 
    Message_subscribe_for_location_update, Message_unsubscribe_for_location_update, Message_unsubscribe_for_all_location_update

} from '../customTypes/message'
import { MESSAGE_TYPE, CHANNEL, QUEUE, REQEST_TIMEOUT, LOCATION_HASH } from './utils/constants';
import { encodeMessage, decodeMessage } from './utils/helper';
import createLogger from '@utils/logger';


var logger = createLogger("websocket.WSConnection")
class WSConnection {
    ws: WebSocket;
    userID: string;
    redis: Redis.Redis;
    rChannelLisner: Redis.Redis;
    mqListner: Redis.Redis;
    isClosed: Boolean;

    constructor(ws: WebSocket, userID: string) {
        this.ws = ws;
        this.userID = userID
        this.redis = new Redis();
        this.rChannelLisner = new Redis();
        this.mqListner = new Redis();
        this.consume()
        ws.on('message', this.onMessage)
        this.isClosed = false;
        ws.on('close', this.onClose)
    }

    consume() {
        this.mqListner.blpop(`${QUEUE.MESSAGE}:${this.userID}`, 0).then(([queue, data]) => {
            const message = decodeMessage(data)
            if(typeof message === 'string') {
                logger.error(`cannot decode the message from {QUEUE.MESSAGE}:${this.userID} ${message}`)
                return;
            }
            console.log(message)
            switch(message.type) {
                case MESSAGE_TYPE.RIDER_RIDE_REQUEST:
                    this.ws.send(JSON.stringify(message))
                    break;
                case MESSAGE_TYPE.RIDE_REQUEST_REJECT:
                    this.ws.send(JSON.stringify(message))
                    break;
                case MESSAGE_TYPE.RIDE_REQUEST_ACCEPT:
                    this.ws.send(JSON.stringify(message))
                    break;
                case MESSAGE_TYPE.RIDE_STOP:
                    this.ws.send(JSON.stringify(message))
                    break;
                default:
                    logger.error(`Unknown message found ${message.type} ${JSON.stringify(message)}`)
            }
        })
        .catch((e) => {
            if(!this.isClosed) {
                logger.error(`cannot push message to list userID: ${this.userID} message:${e}`)
            }
        })
        .finally(() => {
            if(!this.isClosed) {
                this.consume()
            }
        })
        this.rChannelLisner.on("message", (channel, message) => {
            this.ws.send(message)
        })
    }

    onClose = (event: any) => {
        this.isClosed = true
        this.mqListner.disconnect()
        this.rChannelLisner.disconnect()
        this.redis.disconnect()
    }
    
    onMessage = (data: Buffer) => {
        const message = decodeMessage(data)

        if(typeof message === 'string') {
            logger.error(`cannot decode the message from client ${message}`)
            return;
        }
        console.log(JSON.stringify(message));
        try {
            switch(message.type) {
                case MESSAGE_TYPE.LOCATION_UPDATE:
                    this.handleLocationUpdate(message)
                    break;
                
                case MESSAGE_TYPE.RIDER_RIDE_REQUEST:
                    this.handleRiderRequestRide(message)
                    break;
                
                case MESSAGE_TYPE.RIDE_REQUEST_REJECT:
                    this.handleRideRequestReject(message)
                    break;
                
                case MESSAGE_TYPE.RIDE_REQUEST_ACCEPT:
                    this.handleRideRequestAccept(message)
                    break;
                
                case MESSAGE_TYPE.RIDE_STOP:
                    this.handleRideStop(message)
                    break;
    
                case MESSAGE_TYPE.SUBSCRIBE_FOR_LOCATION_UPDATE:
                    this.handleSubscribeForLocationUpdate(message)
                    break;
                
                case MESSAGE_TYPE.UNSUBSCRIBE_FOR_LOCATION_UPDATE:
                    this.handleUnsubscribeForLocationUpdate(message)
                    break;
                case MESSAGE_TYPE.UNSUBSCRIBE_FOR_ALL_LOCATION_UPDATE:
                    this.handleUnsubscribeForAllLocationUpdate(message)
                default:
                    logger.error(`${JSON.stringify(message)} not supported`)
            }
        } catch(e) {
            logger.error(e)
        }    
    }

    handleLocationUpdate = async (message: Message_Location_Update) => {
        await this.redis.publish(`${CHANNEL.LOCATION}:${this.userID}`, JSON.stringify(message))
        await this.redis.hset(LOCATION_HASH, this.userID ,JSON.stringify(message))
    }

    handleRiderRequestRide = async (message: Message_Request_Ride) => {
        if(message.createdTS< Date.now() - REQEST_TIMEOUT) {
            return
            // maybe console log that the messge was timedout
        }
        await this.redis.rpush(`${QUEUE.MESSAGE}:${message.driverID}`, encodeMessage(message))
    }

    handleRideRequestReject = async (message: Message_ride_request_reject) => {
        if(message.createdTS < Date.now() - REQEST_TIMEOUT) {
             return
            // maybe console log that the messge was timedout
        }
        await this.redis.rpush(`${QUEUE.MESSAGE}:${message.riderID}`, encodeMessage(message))
    }

    handleRideRequestAccept = async (message: Message_ride_request_accept) => {
      await this.redis.rpush(`${QUEUE.MESSAGE}:${message.riderID}`, encodeMessage(message))
    }

    handleRideStop = async (message: Message_ride_stop) => {
      await this.redis.rpush(`${QUEUE.MESSAGE}:${message.receiverID}`, encodeMessage(message))
    }

    handleSubscribeForLocationUpdate = async (message: Message_subscribe_for_location_update) => {
        await this.rChannelLisner.subscribe(`${CHANNEL.LOCATION}:${message.userID}`)
    }

    handleUnsubscribeForLocationUpdate = async (message: Message_unsubscribe_for_location_update) => {
        await this.rChannelLisner.unsubscribe(`${CHANNEL.LOCATION}:${message.userID}`)
    }

    handleUnsubscribeForAllLocationUpdate = async(message: Message_unsubscribe_for_all_location_update) => {
        await this.rChannelLisner.unsubscribe()
    }

}

export default WSConnection;