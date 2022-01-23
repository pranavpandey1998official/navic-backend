import { Schema, model} from 'mongoose';

const UserSchema = new Schema({
    name: String,
    phoneNumber: Number,
    aadharNumber: Number,
    passwordHash: String,
    image: String,
    driverLicence: String,
    isDriver: Boolean,
})

/*
 TODO: 1: introduce auth token which expires in 12 hours hence you can gurentee only one user is logged in at a time
*/

export default model('User', UserSchema)
