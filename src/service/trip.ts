import { MongoError } from 'mongodb';

import Trip from 'data/models/trip';
import { Direction } from 'data/models/common';
import { MAX_INITIAL_WALKING_DISTANCE } from '@utils/contants';
import { ERRORS, RequestError } from '@utils/error';

export async function insertTrip(userID: string, direction: Direction) {
    try {
        const trip = await Trip.create({
            userID: userID,
            startTS: Date.now(),
            direction: direction
        })
        return trip;
    } catch(e) {
        if(e instanceof MongoError) {
            if(e.code == 11000) {
                throw ERRORS.ANOTHER_TRIP_EXISTS
            }
            throw ERRORS.DATABASE_ERROR
        }
        console.log(e)
        throw e
    }
}

export async function deleteTrip(userID: string, tripID: string) {
    try {
        await Trip.findOneAndDelete({ userID: userID,  __id: tripID })
    } catch(e) {
        if(e instanceof MongoError) {
            //TODO change this
            throw ERRORS.DATABASE_ERROR
        }
        console.log(e)
        throw ERRORS.DATABASE_ERROR
    }
}

export async function getTripFromUserID(userID: string) {
    try {
        const trip = await Trip.findOne({ userID: userID })
        if(!trip) {
            throw ERRORS.CANNOT_FIND_TRIP
        }
        return trip
    } catch(e) {
        if(e instanceof RequestError) {
            throw e
        }
        if(e instanceof MongoError) {
            //TODO change this
            throw ERRORS.DATABASE_ERROR
        }
        throw ERRORS.DATABASE_ERROR
    }
    
}

export async function getTripWithin(coordinates: Array<Number>) {
    return await Trip.find({
        'direction.geometry': {
            $nearSphere: {
                $geometry:{ 
                    type:"Point",
                    coordinates: coordinates
                },
                $minDistance: 0,
                $maxDistance: MAX_INITIAL_WALKING_DISTANCE
            }
        }
    })
}
