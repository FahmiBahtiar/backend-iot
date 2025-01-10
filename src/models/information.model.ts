import mongoose from "mongoose";


const informationSchema = new mongoose.Schema({
    state:{
        manualMode: {
            default:false,
            type: Boolean,
            required: false
        },
        relay:{
            type: Boolean,
            default:false,
            required:false
        }
    },
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