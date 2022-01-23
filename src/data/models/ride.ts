import { Schema, model} from 'mongoose';

const RideSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    cost: Number,
    startTime: Date
})

export default model('Ride', RideSchema);