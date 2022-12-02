import axios from "axios"

import { VALHALLA_URL } from "@utils/contants"
import { ERRORS } from "@utils/error"

const x = {
    "trip": {
        "locations": [
            {
                "type": "break",
                "lat": 30.32437,
                "lon": 78.013,
                "original_index": 0
            },
            {
                "type": "break",
                "lat": 30.3193,
                "lon": 78.032,
                "city": "left",
                "original_index": 1
            }
        ],
        "legs": [
            {
                "maneuvers": [
                    {
                        "type": 1,
                        "instruction": "Walk north on General Mahadev Singh (GMS) Road.",
                        "verbal_succinct_transition_instruction": "Walk north.",
                        "verbal_pre_transition_instruction": "Walk north on General Mahadev Singh (GMS) Road.",
                        "verbal_post_transition_instruction": "Continue for 300 meters.",
                        "street_names": [
                            "General Mahadev Singh (GMS) Road"
                        ],
                        "time": 186.407,
                        "length": 0.264,
                        "cost": 186.407,
                        "begin_shape_index": 0,
                        "end_shape_index": 4,
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
                        "verbal_post_transition_instruction": "Continue for 400 meters.",
                        "time": 276,
                        "length": 0.391,
                        "cost": 41404.999,
                        "begin_shape_index": 4,
                        "end_shape_index": 13,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    },
                    {
                        "type": 15,
                        "instruction": "Turn left.",
                        "verbal_transition_alert_instruction": "Turn left.",
                        "verbal_succinct_transition_instruction": "Turn left. Then Turn left.",
                        "verbal_pre_transition_instruction": "Turn left. Then Turn left.",
                        "verbal_post_transition_instruction": "Continue for 20 meters.",
                        "time": 10.588,
                        "length": 0.015,
                        "cost": 1588.234,
                        "begin_shape_index": 13,
                        "end_shape_index": 15,
                        "has_time_restrictions": false,
                        "verbal_multi_cue": true,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    },
                    {
                        "type": 15,
                        "instruction": "Turn left.",
                        "verbal_transition_alert_instruction": "Turn left.",
                        "verbal_succinct_transition_instruction": "Turn left. Then Turn right onto Kanwali Road.",
                        "verbal_pre_transition_instruction": "Turn left. Then Turn right onto Kanwali Road.",
                        "verbal_post_transition_instruction": "Continue for 20 meters.",
                        "time": 11.588,
                        "length": 0.015,
                        "cost": 16.882,
                        "begin_shape_index": 15,
                        "end_shape_index": 17,
                        "has_time_restrictions": false,
                        "verbal_multi_cue": true,
                        "travel_mode": "drive",
                        "travel_type": "car"
                    },
                    {
                        "type": 10,
                        "instruction": "Turn right onto Kanwali Road.",
                        "verbal_transition_alert_instruction": "Turn right onto Kanwali Road.",
                        "verbal_succinct_transition_instruction": "Turn right.",
                        "verbal_pre_transition_instruction": "Turn right onto Kanwali Road.",
                        "verbal_post_transition_instruction": "Continue for 1.5 kilometers.",
                        "street_names": [
                            "Kanwali Road"
                        ],
                        "time": 155.688,
                        "length": 1.725,
                        "cost": 245.41,
                        "begin_shape_index": 17,
                        "end_shape_index": 57,
                        "has_time_restrictions": false,
                        "travel_mode": "drive",
                        "travel_type": "car"
                    },
                    {
                        "type": 15,
                        "instruction": "Turn left.",
                        "verbal_transition_alert_instruction": "Turn left.",
                        "verbal_succinct_transition_instruction": "Turn left.",
                        "verbal_pre_transition_instruction": "Turn left.",
                        "verbal_post_transition_instruction": "Continue for 300 meters.",
                        "time": 242.499,
                        "length": 0.34,
                        "cost": 39162.792,
                        "begin_shape_index": 57,
                        "end_shape_index": 63,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    },
                    {
                        "type": 6,
                        "instruction": "Your destination is on the left.",
                        "verbal_transition_alert_instruction": "Your destination will be on the left.",
                        "verbal_pre_transition_instruction": "Your destination is on the left.",
                        "time": 0,
                        "length": 0,
                        "cost": 0,
                        "begin_shape_index": 63,
                        "end_shape_index": 63,
                        "has_time_restrictions": false,
                        "travel_mode": "pedestrian",
                        "travel_type": "foot"
                    }
                ],
                "edge_id": [
                    750215540034,
                    7723068738,
                    750483975490,
                    750316203330,
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
                    105567792450,
                    936341974338,
                    42686786882,
                    526877240642,
                    758637702466,
                    105534238018
                ],
                "summary": {
                    "has_time_restrictions": true,
                    "min_lat": 30.317681,
                    "min_lon": 78.012376,
                    "max_lat": 30.326681,
                    "max_lon": 78.032076,
                    "time": 882.771,
                    "length": 2.75,
                    "cost": 82604.726
                },
                "shape": "chzyx@ucpxsCcXlEirAdTaZvF_HxAnJ^~Ds@pHqAlUaDdf@qHbh@{Itb@kHnm@wKlA[DcBJwEKvEJwEZqkAbBaZ|f@ozBfB{H`AqEfDoMzA_FfK_]tB_HpAwGxDoRjE_l@bHy{@xF}r@P_An@oDhMkr@t@wGbJcx@l@eFh@}ERkC`KsuAlBiVvDwg@~@kMxCiYpBsRtDqGdAkAzUqWnAuAdDmBdYmPdMkHdFwDtSsO`DcBpy@ac@`GiAmHqS}@mCsGoRkZ}|@O]ym@wsA"
            }
        ],
        "summary": {
            "has_time_restrictions": false,
            "min_lat": 30.317681,
            "min_lon": 78.012376,
            "max_lat": 30.326681,
            "max_lon": 78.032076,
            "time": 882.771,
            "length": 2.75,
            "cost": 82604.726
        },
        "status_message": "Found route between points",
        "status": 0,
        "units": "kilometers",
        "language": "en-US"
    },
    "tripID": "63131aec8b23ab5667d5e0e9",
    "driverID": "63024b1af76e31a7b60c9992"
}

export async function getCarpoolingRoute(locations: Object, costing: string, previousRequestedTrip?: string[] ) {
    return x
}

export async function getDriversRoute(locations: Object, costing: string ) {
    try {
        const body = {
            locations,
            costing,
            language: "en-US"
        }
        //TODO check if the location between defined bbox
        const response =  await axios.post(`${VALHALLA_URL}/route`, 
            body
        )
        console.log(response.data)
        return response.data
    } catch(e) {
        throw ERRORS.CANNOT_CONTACT_VALHALLA
    }
} 