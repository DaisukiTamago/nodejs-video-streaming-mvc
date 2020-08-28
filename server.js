import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import router from './api/routes/index.js'
import morgan from 'morgan'
import cors from 'cors'

const { DB_NAME, DB_ATLAS_PASSWORD, DB_ATLAS_USERNAME, ADRESS, PORT } = process.env
const connect_uri = `mongodb+srv://${DB_ATLAS_USERNAME}:${DB_ATLAS_PASSWORD}@heaven-qnifr.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(connect_uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    const app = express()

    app.use(cors())
    app.use(morgan("dev"))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use('/api', router)
    app.use('/', express.static('public'));


    app.listen(PORT, ADRESS, () => {
        console.log('running server...')
    })
})


