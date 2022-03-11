import {Router} from 'express';
import axios, { AxiosError } from 'axios';
import { MIN_PICKUP_DISTANCE, VALHALLA_URL } from '@utils/contants';
import createLogger from '@utils/logger';
import { RouteRequest } from '@customTypes/route';
import { getTripWithin } from 'service/trip';
import turf, { distance as turfDistance, nearestPointOnLine, booleanPointOnLine } from '@turf/turf';
import { point, lineString as turfLineString, Feature, Point} from '@turf/helpers';
import { segmentReduce } from '@turf/meta';
import { getCurrentLocation } from 'service/user';
import { Message_Location_Update } from '@customTypes/message';

var logger = createLogger("controller.route")
var router = Router();

const EPSILON = 0.00000005

router.post('/', async function(req, res) {
    try {
        const response = await axios.post(`${VALHALLA_URL}/route`, 
            req.body
        )
        res.status(response.status).send(response.data)
    } catch(e) {
        logger.error(e)
        res.status(500).send(e)
    }
})

router.post('/temp', async function (req, res) {
    const routeRequest: RouteRequest = req.body
    try {
        const startCoordinates = [routeRequest.locations[0].lon, routeRequest.locations[0].lat]
        const endCoordinates = [routeRequest.locations[1].lon, routeRequest.locations[1].lat]
        const trips = await getTripWithin(startCoordinates);

        if(trips.length == 0) {
            res.send(506).send("Cannot find any trips happing nearby")
        }

        const currentLocationMap: Map<string, Message_Location_Update> = new Map()
        const startPoint = point(startCoordinates);
        const filteredTrips = await trips.filter(async (trip) => {
            const userID = trip.userID.toString()
            const driverCurrentLocation = await getCurrentLocation(userID)
            if(!driverCurrentLocation) {
                return false
            }

            currentLocationMap.set(userID, driverCurrentLocation);

            // If user is offroute don't take it, 
            // TODO: probrably have a more intutive way to filtering this like maybe consecutive 5 userOff route
            if (driverCurrentLocation.isOffRoute) {
                return false
            }

            // If user last location is older than 60sec
            if (Date.now() - driverCurrentLocation.ts > 60000) {
                return false
            }
            const driverLocation = driverCurrentLocation.snappedLocation ?? driverCurrentLocation.rawLocation
            const driverLocationCoordinates = [driverLocation.lon, driverLocation.lat]
            const driverPoint = point(driverLocationCoordinates)
            const lineString = turfLineString(trip.direction.geometry.coordinates)
            const pickupPoint = nearestPointOnLine(lineString, startPoint)
            const driverLocationSnapped = nearestPointOnLine(lineString, driverPoint)

            let distances = findDistances(lineString, pickupPoint, driverLocationSnapped, EPSILON)

            if(!distances.driverDistance || !distances.pickupDistance) {
                // try with relaxed eplison
                distances = findDistances(lineString, pickupPoint, driverLocationSnapped, EPSILON * 100)
                if(!distances.driverDistance || !distances.pickupDistance) {
                    return false
                }
            }
            if(distances.pickupDistance - distances.driverDistance < MIN_PICKUP_DISTANCE) {
                return false
            }
            return true
        })
        const nearbyTrips = await Promise.all(filteredTrips.map(async (trip) => {
            let currentLocation = currentLocationMap.get(trip.userID.toString())
            if(!currentLocation) {
                currentLocation = await getCurrentLocation(trip.userID.toString())
            }
            return {
                edge_ids: trip.direction.legs[0].edgeID,
                trip_id: trip._id.toString(),
                current_location: {
                    lat: currentLocation.snappedLocation.lat,
                    lon: currentLocation.snappedLocation.lon
                }
                
            };
        }))
        const newRouteRequest = {
            ...routeRequest,
            nearby_trips: nearbyTrips
        }

        try {
            const response = await axios.post(`${VALHALLA_URL}/route`, 
                newRouteRequest
            )
            console.log(response.data)
            res.send(response.data)
        } catch(e) {
            logger.error(e)
            res.send(e)
        }
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

function findDistances(
    lineString:Feature<turf.helpers.LineString>, 
    pickupLocation: Feature<Point>, 
    driverLocation: Feature<Point>,
    epsilon: number
    ) {
    let driverDistance = 0;
    let pickupDistance = 0;

    segmentReduce(
        lineString,
        (previousValue, segment) => {
            if( !segment ){
                return 0;
            }
            const coords = segment.geometry.coordinates
            if(typeof(previousValue) == "undefined") {
                return 0
            }
            if(booleanPointOnLine(pickupLocation.geometry, segment.geometry, {epsilon: epsilon})) {
                const distance = turfDistance(coords[0], pickupLocation.geometry.coordinates) * 1000
                pickupDistance = previousValue + distance
            }
            if(booleanPointOnLine(driverLocation.geometry, segment.geometry, {epsilon: epsilon})) {
                const distance = turfDistance(coords[0], driverLocation.geometry.coordinates) * 1000
                driverDistance = previousValue + distance
            }
            return previousValue + turfDistance(coords[0], coords[1]) * 1000
        }, 
        0
    )

    return {
        driverDistance,
        pickupDistance
    }
}


export default router;