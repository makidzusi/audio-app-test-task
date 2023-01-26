import express from 'express'
import TrackController from "../controllers/TrackController.js";
import {upload} from "../multer/index.js";

const router = express.Router()

router.post('/save', upload.single('file'), TrackController.saveTrack)
router.get('/tracks', TrackController.getTracks)

export default router
