import multer from "multer";
import path from "path";
import {randomUUID} from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/')
    },
    filename: function (req, file, cb) {
        cb(null, randomUUID() + path.extname(file.originalname))
    }
})

export const upload = multer({
    storage
})
