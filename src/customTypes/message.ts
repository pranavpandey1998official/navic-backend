import { MESSAGE_TYPE } from "../websocket/utils/constants";

type LatLng = {
    lat: number
    lon: number
}

type Message_Location_Update = {
    type: MESSAGE_TYPE.LOCATION_UPDATE
    userID: string
    snappedLocation: LatLng
    rawLocation: LatLng
    isOffRoute: boolean
    createdTS: number
}

type Message_Request_Ride = {
    type: MESSAGE_TYPE.RIDER_RIDE_REQUEST
    driverID: string
    riderID: string
    tripID: string
    pickupLocation: LatLng
    dropLocation: LatLng
    cost: Number
    shape: string
    riderName: string,
    riderProfilePhotoURL: string,
    createdTS: Number //Make sure it is Always in UTC,
    trip: object
}

type Message_ride_request_reject = {
    type: MESSAGE_TYPE.RIDE_REQUEST_REJECT
    riderID: string,
    driverID: string,
    tripID: string,
    createdTS: Number
}

type Message_ride_request_accept = {
    type: MESSAGE_TYPE.RIDE_REQUEST_ACCEPT,
    ride: object,
    riderID: string,
    driverID: string,
    tripID: string,
    createdTS: Number
}

type Message_ride_request_accept_ack = {
    type: MESSAGE_TYPE.RIDE_REQUEST_ACCEPT_ACK,
    riderID: string,
    driverID: string,
    tripID: string,
    createdTS: Number
}

type Message_ride_stop = {
    type: MESSAGE_TYPE.RIDE_STOP,
    createdTS: Number,
    receiverID: string,
    riderID: string,
    driverID: string,
    rideID: string,
}

type Message_subscribe_for_location_update = {
    type: MESSAGE_TYPE.SUBSCRIBE_FOR_LOCATION_UPDATE,
    createdTS: Number,
    userID: string,
}

type Message_unsubscribe_for_location_update = {
    type: MESSAGE_TYPE.UNSUBSCRIBE_FOR_LOCATION_UPDATE,
    createdTS: Number,
    userID: string,
}

type Message_unsubscribe_for_all_location_update = {
    type: MESSAGE_TYPE.UNSUBSCRIBE_FOR_ALL_LOCATION_UPDATE,
    createdTS: Number,
}

type Message  = Message_Location_Update | Message_Request_Ride | Message_ride_request_reject | Message_ride_request_accept | Message_ride_stop | Message_unsubscribe_for_location_update | Message_subscribe_for_location_update | Message_unsubscribe_for_all_location_update

export  default Message;

export { Message_Location_Update, Message_Request_Ride, Message_ride_request_reject, Message_ride_request_accept, Message_ride_stop, Message_subscribe_for_location_update, Message_unsubscribe_for_location_update, Message_unsubscribe_for_all_location_update}