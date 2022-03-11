import {Schema, model, Types, SchemaTypes } from 'mongoose';
 interface Summary {
    cost: number,
    length: number,
    time: number,
    maxLat: number,
    minLat: number,
    maxLon: number,
    minLon: number
 }


const SummarySchema = new Schema<Summary>({
    cost: Number,
    length: Number,
    time: Number,
    maxLat: Number,
    minLat: Number,
    maxLon: Number,
    minLon: Number
}, { _id : false })

interface Maneuver {
    beginShapeIndex: number,
    cost: number,
    length: number,
    endShapeIndex: number,
    instruction: string,
    roundaboutExitCount: number,
    time: number,
    travelMode: string,
    travelType: string,
    type: number,
    verbalMultiCue: string,
    verbalPostTransitionInstruction: string,
    verbalPreTransitionInstruction: string,
    verbalSuccinctTransitionInstruction: string,
    verbalTransitionAlertInstruction: string,
}

const ManeuverSchema = new Schema<Maneuver>({
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
}, { _id : false })

interface Leg {
    maneuvers?: Types.DocumentArray<Maneuver>,
    shape: string,
    summary: Summary,
    edgeID: Types.DocumentArray<number>
}

const LegSchema = new Schema<Leg>({
    maneuvers: [ManeuverSchema],
    shape: String,
    summary: SummarySchema,
    edgeID: [Number]
}, { _id : false });

export interface Direction {
    language: string,
    legs: Types.DocumentArray<Leg>,
    summary: Summary,
    shape: string,
    locations: [],
    geometry: {
        type: string,
        coordinates: Array<Array<number>>
    },
}

export const DirectionSchema = new Schema<Direction>({
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
}, { _id : false })