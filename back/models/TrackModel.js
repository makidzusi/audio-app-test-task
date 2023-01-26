import mongoose from "mongoose";

const {Schema, model} = mongoose

const TrackSchema = new Schema({
    author: {
        type: Schema.Types.String
    },
    src: {
        type: Schema.Types.String
    },
    title: {
        type: Schema.Types.String
    }

})

export default model("Track", TrackSchema)
