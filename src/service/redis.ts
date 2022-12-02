import Redis from 'ioredis';

import { Message_Location_Update } from "@customTypes/message";
import { MESSAGE_TYPE, OTP_HASH } from "websocket/utils/constants";

export async function getCurrentLocation(userID: string): Promise<Message_Location_Update> {
    return {
        type: MESSAGE_TYPE.LOCATION_UPDATE,
        snappedLocation: {
            lat: 30.323375522065525,
            lon: 78.00548970602715
        },
        userID: "63099c21726ec5638d852429",
        rawLocation: {
            lat: 30.323375522065525,
            lon: 78.00548970602715
        },
        isOffRoute: false,
        createdTS: Date.now(),
    }
}

export async function setPhoneOTP(phoneNumber: string, otp: string) {
    const redis = new Redis();
    await redis.hset(OTP_HASH, phoneNumber, otp)
    await getPhoneOTP(phoneNumber)
}

export async function getPhoneOTP(phoneNumber: string): Promise<string> {
    const redis = new Redis();
    const otp = await redis.hget(OTP_HASH, phoneNumber);
    if(otp != null) {
        return otp
    }
    return ""
}