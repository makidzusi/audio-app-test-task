import TrackModel from "../models/TrackModel.js";

class TrackService {
    async saveTrack(req) {
        const data = req.body
        return await TrackModel.create({
            author: data.author,
            title: data.title,
            src: `files/${req.file.filename}`
        })
    }

    async getTracks() {
        return TrackModel.find();
    }
}

export default new TrackService()
