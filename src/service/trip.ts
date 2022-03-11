import Trip from 'data/models/trip';
import { Direction } from 'data/models/common';
import { Types } from 'mongoose';
import { MAX_INITIAL_WALKING_DISTANCE } from '@utils/contants';

export async function insertTrip(userID: string, direction: Direction) {
    const trip = new Trip({
        userID: userID,
        startTS: Date.now(),
        direction: direction
    })
    await trip.save()
    return trip;
}

export async function deleteTrip(userID: string, tripID: string) {
    await Trip.deleteOne({ userID: userID,  __id: tripID }).remove()
}

export async function getTrip(userID: string) {
    return await Trip.findOne({ userID: userID })
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
