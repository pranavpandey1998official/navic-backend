import {Router} from 'express';
import axios, { AxiosError } from 'axios';
import z from 'zod';
import turf, { distance as turfDistance, nearestPointOnLine, booleanPointOnLine } from '@turf/turf';
import { point, lineString as turfLineString, Feature, Point} from '@turf/helpers';

import { MIN_PICKUP_DISTANCE, VALHALLA_URL } from '@utils/contants';
import createLogger from '@utils/logger';
import { RouteRequest } from '@customTypes/route';
import { getTripWithin } from 'service/trip';
import { segmentReduce } from '@turf/meta';
import { getCurrentLocation } from 'service/user';
import { Message_Location_Update } from '@customTypes/message';
import validateRequest from '@middleware/validateRequst';
import { ERRORS } from '@utils/error';
import { getCarpoolingRoute, getDriversRoute } from 'service/valhalla';

var logger = createLogger("controller.route")
var router = Router();

const EPSILON = 0.00000005

const CONSTING = {
    AUTO: "auto",
    CARPOOLING: "carpooling"
}

const x = {
    "driverID": "63099c21726ec5638d852429",
    "tripID": "62c10a295ed92fa4486507c0",
    "trip": {
        "locations": [
            {
                "type": "break",
                "lat": 30.322825,
                "lon": 78.004966,
                "city": "left",
                "original_index": 0
            },
            {
                "type": "break",
                "lat": 30.321906,
                "lon": 78.032792,
                "original_index": 1
            }
        ],
        "legs": [
            {
                "maneuvers": [
                    {
                        "type": 3,
                        "instruction": "Walk north.",
                        "verbal_succinct_transition_instruction": "Walk north.",
                        "verbal_pre_transition_instruction": "Walk north.",
                        "verbal_post_transition_instruction": "Continue for 60 meters.",
                        "time": 45.231,
                        "length": 0.064,
                        "cost": 45.231,
                        "begin_shape_index": 0,
                        "end_shape_index": 2,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    },
                    {
                        "type": 13,
                        "instruction": "Make a left U-turn.",
                        "verbal_transition_alert_instruction": "Make a left U-turn.",
                        "verbal_succinct_transition_instruction": "Make a left U-turn.",
                        "verbal_pre_transition_instruction": "Make a left U-turn.",
                        "verbal_post_transition_instruction": "Continue for 300 meters.",
                        "time": 118.859,
                        "length": 0.291,
                        "cost": 173.209,
                        "begin_shape_index": 2,
                        "end_shape_index": 9,
                        "has_time_restrictions": false,
                        "travel_mode": "drive",
                        "travel_type": "car",
                        "carpool_trip_id": "62bbe6df0d3ae0ca2be14428"
                    },
                    {
                        "type": 10,
                        "instruction": "Turn right onto Kanwali Road.",
                        "verbal_transition_alert_instruction": "Turn right onto Kanwali Road.",
                        "verbal_succinct_transition_instruction": "Turn right.",
                        "verbal_pre_transition_instruction": "Turn right onto Kanwali Road.",
                        "verbal_post_transition_instruction": "Continue for 2.5 kilometers.",
                        "street_names": [
                            "Kanwali Road"
                        ],
                        "time": 209.96,
                        "length": 2.265,
                        "cost": 334.722,
                        "begin_shape_index": 9,
                        "end_shape_index": 60,
                        "has_time_restrictions": false,
                        "travel_mode": "drive",
                        "travel_type": "car",
                        "carpool_trip_id": "62bbe6df0d3ae0ca2be14428"
                    },
                    {
                        "type": 15,
                        "instruction": "Turn left.",
                        "verbal_transition_alert_instruction": "Turn left.",
                        "verbal_succinct_transition_instruction": "Turn left.",
                        "verbal_pre_transition_instruction": "Turn left.",
                        "verbal_post_transition_instruction": "Continue for 200 meters.",
                        "time": 111.529,
                        "length": 0.158,
                        "cost": 16734.411,
                        "begin_shape_index": 60,
                        "end_shape_index": 71,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    },
                    {
                        "type": 24,
                        "instruction": "Keep left at the fork.",
                        "verbal_transition_alert_instruction": "Keep left at the fork.",
                        "verbal_pre_transition_instruction": "Keep left at the fork.",
                        "verbal_post_transition_instruction": "Continue for 300 meters.",
                        "time": 241.705,
                        "length": 0.341,
                        "cost": 36106.884,
                        "begin_shape_index": 71,
                        "end_shape_index": 87,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    },
                    {
                        "type": 15,
                        "instruction": "Turn left onto Tilak Road.",
                        "verbal_transition_alert_instruction": "Turn left onto Tilak Road.",
                        "verbal_succinct_transition_instruction": "Turn left.",
                        "verbal_pre_transition_instruction": "Turn left onto Tilak Road.",
                        "verbal_post_transition_instruction": "Continue for 100 meters.",
                        "street_names": [
                            "Tilak Road"
                        ],
                        "time": 85.209,
                        "length": 0.12,
                        "cost": 17233.968,
                        "begin_shape_index": 87,
                        "end_shape_index": 91,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    },
                    {
                        "type": 4,
                        "instruction": "You have arrived at your destination.",
                        "verbal_transition_alert_instruction": "You will arrive at your destination.",
                        "verbal_pre_transition_instruction": "You have arrived at your destination.",
                        "time": 0,
                        "length": 0,
                        "cost": 0,
                        "begin_shape_index": 91,
                        "end_shape_index": 91,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    }
                ],
                "edge_id": [
                    313974369602,
                    313974369602,
                    314242805058,
                    314645458242,
                    748168719682,
                    314779675970,
                    172106231106,
                    314477686082,
                    172005567810,
                    84898262338,
                    751691935042,
                    750316203330,
                    749980659010,
                    45740240194,
                    925134794050,
                    45438250306,
                    45371141442,
                    45304032578,
                    194017275202,
                    84529163586,
                    305283771714,
                    78858464578,
                    606233472322,
                    917987700034,
                    192742206786,
                    45203369282,
                    192507325762,
                    606132809026,
                    917450829122,
                    605730155842,
                    1026100079938,
                    192138227010,
                    191903345986,
                    166301314370,
                    935402450242,
                    605461720386,
                    936744627522,
                    936576855362,
                    105634901314,
                    936140647746,
                    106238881090,
                    106138217794,
                    105869782338,
                    758704811330,
                    1039588961602,
                    289211198786
                ],
                "summary": {
                    "has_time_restrictions": true,
                    "min_lat": 30.319159,
                    "min_lon": 78.005022,
                    "max_lat": 30.324513,
                    "max_lon": 78.032759,
                    "time": 812.495,
                    "length": 3.24,
                    "cost": 70628.429
                },
                "shape": "}awyx@a_axsCcV}HsIyCnx@|[oMeIk_@}LsIyC{ZuKgS_Ii\\iM|]qgAbCcKdMih@hCuKd@iKPmDsEmhAzCst@xAyN~Io}@fBoQXoEnFqz@DcBJwEZqkAbBaZ|f@ozBfB{H`AqEfDoMzA_FfK_]tB_HpAwGxDoRjE_l@bHy{@xF}r@P_An@oDhMkr@t@wGbJcx@l@eFh@}ERkC`KsuAlBiVvDwg@~@kMxCiYpBsRtDqGdAkAzUqWnAuAdDmBdYmPdMkHdFwDkMqRcFqH}AeEOwF^aGLuBlAkI`CqH`BkEb@{Dg@cBo@{BmN_YaKyT}EkHoD_DsC{BeCqEuFqMqIsPsEwIsDkIMkLe@gKqAaHgCwJwAuKik@cEu@E{Bm@mOaE"
            }
        ],
        "summary": {
            "has_time_restrictions": false,
            "min_lat": 30.319159,
            "min_lon": 78.005022,
            "max_lat": 30.324513,
            "max_lon": 78.032759,
            "time": 812.495,
            "length": 3.24,
            "cost": 70628.429
        },
        "status_message": "Found route between points",
        "status": 0,
        "units": "kilometers",
        "language": "en-US"
    }
}

const SCHEMA = ({
    ROUTE: z.object({
        locations: z.array(
            z.object({
                lat: z.number(),
                lon: z.number(),
                type: z.string()
            })
        ),
        previousRequestedTrip: z.array(z.string()).optional(),
        costing: z.string().min(1)
    })
})

router.post('/', 
validateRequest({
    body: SCHEMA.ROUTE
}), async function(req, res, next) {
    const body: z.infer<typeof SCHEMA.ROUTE> = req.body
    try {
        if(body.costing == CONSTING.CARPOOLING) {
            const route = await getCarpoolingRoute(body.locations, body.costing, body.previousRequestedTrip)
            res.send(route)
        }
        else if(body.costing == CONSTING.AUTO) {
            const route =  await getDriversRoute(body.locations, body.costing)
            res.send(route)
        }
        else {
            throw ERRORS.UNSUPPORTED_COSTING
        }
    } catch(e) {
        logger.error(e)
        next(e)
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