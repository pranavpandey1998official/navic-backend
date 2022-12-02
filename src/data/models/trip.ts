import {Schema, model, Types} from 'mongoose';
import { DirectionSchema, Direction } from './common';

interface Trip {
    userID: Types.ObjectId,
    direction: Direction
    createdTS: number
}

const TripSchema = new Schema<Trip>({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    direction: DirectionSchema,
    createdTS: Number,
});

TripSchema.index({ userId: 1}, { unique: true } )
TripSchema.index({ 'direction.geometry': '2dsphere' });


export default model<Trip>('Trip', TripSchema);