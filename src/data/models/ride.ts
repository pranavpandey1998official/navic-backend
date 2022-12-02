import {Schema, model, Types} from 'mongoose';
import { DirectionSchema, Direction } from './common';

interface Ride {
    riderID: Types.ObjectId,
    driverID: Types.ObjectId,
    tripID: Types.ObjectId,
    direction: Direction,
    cost: number,
    createdTS: number
}

const RideSchema = new Schema<Ride>({
    riderID: { type: Schema.Types.ObjectId, ref: 'User' },
    tripID: { type: Schema.Types.ObjectId, ref: 'Trip' },
    driverID: { type: Schema.Types.ObjectId, ref: 'User' },
    direction: DirectionSchema,
    cost: Number,
    createdTS: Number,
})

RideSchema.index({ riderID: 1}, { unique: true } )
RideSchema.index({ tripID: 1}, { unique: true } )

export default model<Ride>('Ride', RideSchema);