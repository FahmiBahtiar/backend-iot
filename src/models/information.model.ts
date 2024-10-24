import mongoose from "mongoose";


const informationSchema = new mongoose.Schema({
    distance: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    temperature: {
        type: String,
        required: true
    },
    // timestamp: {
    //     type: Date,
    //     required: true
    // },
    createdAt : {
        type: Date,
        default: Date.now
    }
});

export const Information = mongoose.model("Information", informationSchema);