import { Schema, model} from 'mongoose';
import { COMPANION_PREFERENCE, DEFAULT_IMAGE_URL } from 'websocket/utils/constants';


export interface User {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    gender: String
    imageURL: String,
    authToken: String,
    refreshToken: String,
    companionPreference: String,
}


const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    gender: String,
    authToken: String,
    refreshToken: String,
    companionPreference: { type: String, default: COMPANION_PREFERENCE.ANY},
    imageURL: { type: String, default: DEFAULT_IMAGE_URL },
})

UserSchema.index({ phoneNumber: 1}, { unique: true } )
export default model<User>('User', UserSchema)
