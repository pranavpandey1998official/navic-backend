import {Schema, model} from 'mongoose';

const SummarySchema = new Schema({
    cost: Number,
    length: Number,
    time: Number,
    maxLat: Number,
    minLat: Number,
    maxLon: Number,
    minLon: Number
})

const ManeuverSchema = new Schema({
    beginShapeIndex: Number,
    cost: Number,
    length: Number,
    endShapeIndex: Number,
    instruction: String,
    roundaboutExitCount: Number,
    time: Number,
    travelMode: String,
    travelType: String,
    type: Number,
    verbalMultiCue: String,
    verbalPostTransitionInstruction: String,
    verbalPreTransitionInstruction: String,
    verbalSuccinctTransitionInstruction: String,
    verbalTransitionAlertInstruction: String,
})

const LegSchema = new Schema({
    maneuvers: [ManeuverSchema],
    shape: String,
    summary: SummarySchema,
    edgeId: [Number]
});

export const DirectionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    language: String,
    legs: [LegSchema],
    summary: SummarySchema,
    shape: String,
    locations: [],
    geometry: {
            type: {
                type: String,
                enum: ['LineString'],
                required: true
                },
            coordinates: [[Number]]
        }
})