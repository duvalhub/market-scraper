import express from 'express'
import { RecordRepository } from './posts'
const app = express()
const port = process.env.PORT || 8080


app.get('/', async (req, res, next) => {
    const records = await RecordRepository.findAll()
    res.json(records)
})

export const launchServer = () => {
    return new Promise<void>((res) => {
        app.listen(port, () => {
            console.log(`App listening to port ${port}`)
            res()
        })
    })
}