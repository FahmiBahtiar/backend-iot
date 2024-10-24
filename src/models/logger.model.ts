import mongoose, { mongo } from "mongoose";

const loggerSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete']
    },
    informationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Information'
    },
    previousData:{
        type : mongoose.Schema.Types.Mixed,
        default: null
    },
    newData:{
        type : mongoose.Schema.Types.Mixed,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    }
});

export const Logger = mongoose.model("Logger", loggerSchema);