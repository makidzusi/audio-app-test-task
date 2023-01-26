import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import {fileURLToPath} from 'url';
import path from 'path'
import cors from 'cors'
import router from './router/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors())
app.use('/api', router)
app.use('/files', express.static(__dirname + '/files'));

const PORT = 3020


const start = async () => {
    try {
        console.log(process.env.DB_URL)
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
