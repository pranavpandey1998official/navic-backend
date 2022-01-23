import {Schema, model} from 'mongoose';
import { DirectionSchema } from './common';

const TripSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    directions: DirectionSchema,
    startTime: Date
})


export default model('Trip', TripSchema);