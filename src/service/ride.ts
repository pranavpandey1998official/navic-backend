import { MongoError } from 'mongodb';

import Ride from 'data/models/ride'
import { Direction } from 'data/models/common';
import { ERRORS, RequestError } from '@utils/error';

export async function insertRide(riderID: string, tripID: string, direction: Direction, cost: Number, driverID: string) {
    try {
        const ride = await Ride.create({
            riderID: riderID,
            tripID: tripID,
            driverID: driverID,
            direction: direction,
            cost: cost,
            createdTS: Date.now(),
        })
        return ride;
    } catch(e) {
        if(e instanceof MongoError) {
            if(e.code == 11000) {
                throw ERRORS.ANOTHER_RIDE_EXISTS
            }
            throw ERRORS.DATABASE_ERROR
        }
        console.log(e)
        throw e
    }
}

export async function deleteRideFromID(rideID: string) {
    try {
        await Ride.findByIdAndDelete(rideID)
    } catch(e) {
        if(e instanceof MongoError) {
            //TODO change this
            throw ERRORS.DATABASE_ERROR
        }
        console.log(e)
        throw ERRORS.DATABASE_ERROR
    }
}

export async function getRideFromUserID(userID: string) {
    try {
        const ride = await Ride.findOne({riderID: userID})
        if(!ride) {
            throw ERRORS.CANNOT_FIND_RIDE
        }
        return ride
    } catch(e) {
        if(e instanceof RequestError) {
            throw e
        }
        if(e instanceof MongoError) {
            //TODO change this
            throw ERRORS.DATABASE_ERROR
        }
        console.log(e)
        throw ERRORS.DATABASE_ERROR
    }
}

export async function getRideFromTripID(tripID: string) {
    try {
        const ride = await Ride.findOne({tripID: tripID})
        if(!ride) {
            throw ERRORS.CANNOT_FIND_RIDE
        }
        return ride
    } catch(e) {
        if(e instanceof RequestError) {
            throw e
        }
        if(e instanceof MongoError) {
            //TODO change this
            throw ERRORS.DATABASE_ERROR
        }
        console.log(e)
        throw ERRORS.DATABASE_ERROR
    }
}