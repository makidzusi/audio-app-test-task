import TrackService from "../services/TrackService.js";

class TrackController {
    async getTracks(req,res) {
        const tracks = await TrackService.getTracks()
        return res.json(tracks)
    }
    async saveTrack(req, res) {
        const result = await TrackService.saveTrack(req)
        return res.json(result)
    }
}

export default new TrackController()
