import { Message_Location_Update } from '@customTypes/message'
import User from 'data/models/user'
import { MESSAGE_TYPE } from 'websocket/utils/constants'

export async function addUser() {
    
}

// TODO fix this
export async function getCurrentLocation(userID: string): Promise<Message_Location_Update> {
    return {
        type: MESSAGE_TYPE.LOCATION_UPDATE,
        snappedLocation: {
            lat: 30.323375522065525,
            lon: 78.00548970602715
        },
        rawLocation: {
            lat: 30.323375522065525,
            lon: 78.00548970602715
        },
        isOffRoute: false,
        ts: Date.now(),

    }
}
