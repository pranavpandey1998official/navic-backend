import { Schema, model} from 'mongoose';

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    aadharNumber: Number,
    imageURL: String,
    driverLicenceURL: String,
    isDriver: Boolean,
    refreshToken: String,
})

export default model('User', UserSchema)
