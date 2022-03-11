export type RouteRequest = {
    locations: Array<Location>,
    consting: String,
    language: String,
    nearby_trips?: {
        trip_id: String,
        edge_ids: Array<number>,
        current_location: {
            lat: number,
            lon: number
        }
    }
}

type Location = {
    lat: number,
    lon: number,
    type: String
}