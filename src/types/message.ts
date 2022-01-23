import { MESSAGE_TYPE } from "../websocket/utils/constants";

type Message_Location_Update = {
    type: MESSAGE_TYPE.LOCATION_UPDATE
    userId: string
    lat: number
    lon: number
    isOffRoute: boolean
}

type Message_Request_Ride = {
    requestId: Number,
    type: MESSAGE_TYPE.RIDER_REQUEST_RIDE
    driverId: string
    riderId: string
    direction: Object
    requestTime: Number //Make sure it is Always in UTC
}

type Message  = Message_Location_Update | Message_Request_Ride

export  default Message;

export { Message_Location_Update, Message_Request_Ride}