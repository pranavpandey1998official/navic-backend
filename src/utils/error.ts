// type RequestError = {
//     code: number,
//     message: string,
// }

export class RequestError {
    code: number
    message: string
    statusCode: number
    constructor(message: string, code: number, statusCode: number) {
        this.statusCode = statusCode
        this.message = message
        this.code = code
    }
}

/*
error code stating with 1 is common across all services
error code starting with 2 is for user service flow
error code starting with 3 is for route service flow
error code starting with 4 is for trip service flow
error code starting with 5 is for ride service flow




200 OK - Response to a successful GET, PUT, PATCH or DELETE. Can also be used for a POST that doesn't result in a creation.
201 Created - Response to a POST that results in a creation. Should be combined with a Location header pointing to the location of the new resource
204 No Content - Response to a successful request that won't be returning a body (like a DELETE request)
304 Not Modified - Used when HTTP caching headers are in play
400 Bad Request - The request is malformed, such as if the body does not parse
401 Unauthorized - When no or invalid authentication details are provided. Also useful to trigger an auth popup if the API is used from a browser
403 Forbidden - When authentication succeeded but authenticated user doesn't have access to the resource
404 Not Found - When a non-existent resource is requested
405 Method Not Allowed - When an HTTP method is being requested that isn't allowed for the authenticated user
410 Gone - Indicates that the resource at this end point is no longer available. Useful as a blanket response for old API versions
415 Unsupported Media Type - If incorrect content type was provided as part of the request
422 Unprocessable Entity - Used for validation errors
429 Too Many Requests - When a request is rejected due to rate limiting
500 Internal Server Error - This is either a system or application error, and generally indicates that although the client appeared to provide a correct request, something unexpected has gone wrong on the server
503 Service Unavailable - The server is unable to handle the request for a service due to temporary maintenance
*/

export const ERRORS = {
    DATABASE_ERROR: new RequestError("DATABASE ERROR", 10001, 500),
    INVALID_REQUST_BODY: new RequestError("invalid request body", 10002, 400),
    INVALID_QUERY_PARAMETER: new RequestError("invalid query body", 10003, 400),
    AUTH_NO_TOKEN_FOUND: new RequestError("No token found", 10004, 401),
    AUTH_UNAUTHERISED: new RequestError("UNAUTHERISED", 10005, 401),
    UNHANDLED_ERROR: new RequestError("Some unhandled error occured at server", 10006, 500),
    CONNOT_DETERMINE_TIME: new RequestError("Some unhandled error occured at server", 10007, 500),



    CANNOT_FIND_USER : new RequestError("Cannot find the user", 20001, 404),
    ANOTHER_USER_EXISTS: new RequestError("Another user with same phoneNumber Exists", 20002, 400),
    ANOTHER_USER_LOGGEDIN: new RequestError("Another user already loggedin", 20003, 403),
    INVALID_REFRESH_TOKEN: new RequestError("Invalid refresh token", 20004, 400),
    INVALID_AUTH_TOKEN: new RequestError("Invalid auth token", 20005, 400),
    FILE_NOT_FOUND: new RequestError("cannot find the file", 20006, 400),
    INVALID_OTP: new RequestError("otp that you typed is incorrect", 20007, 400),


    UNSUPPORTED_COSTING: new RequestError("the costing option specified is not supported", 30001 ,400),
    CANNOT_CONTACT_VALHALLA: new RequestError("cannot contact valhalla service", 30002 ,500),
    CANNOT_FIND_ANY_NEARBY_TRIPS: new RequestError("Connot find any trips near you", 30003, 404),

    ANOTHER_RIDE_EXISTS: new RequestError("another ride already going on from the user", 40001, 400),
    CANNOT_FIND_RIDE: new RequestError("cannot find ride", 40002, 404 ),
    CANNOT_START_RIDE_FROM_ANOTHER_DRIVER: new RequestError("driverID provided doesn't match with the user", 40003, 400),

    ANOTHER_TRIP_EXISTS: new RequestError("another trip already going on from the user", 50001, 400),
    CANNOT_FIND_TRIP: new RequestError("cannot find trip", 50002, 404 )

}