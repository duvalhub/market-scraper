import express from 'express'
import { RecordRepository } from './database.js'
const app = express()
const port = process.env.PORT || 8080

app.get('/', async (req, res, next) => {
    try {
        const records = await RecordRepository.findAll()
        res.json(records)
    } catch (err) {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.error(err)
    res.json({
        error: err
    })
})

export const launchServer = () => {
    return new Promise<void>((res) => {
        app.listen(port, () => {
            console.log(`App listening to port ${port}`)
            res()
        })
    })
}