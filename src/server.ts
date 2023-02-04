import express from 'express'
import { RecordRepository } from './database.js'
import { evaluateAllPlays } from './market-data.js'
const app = express()
const port = process.env.PORT || 8080

// TODO: Implement swagger implementation to modify rules
// Check https://www.npmjs.com/package/swagger-ui-express

app.get('/', async (req, res, next) => {
    try {
        const records = await RecordRepository.findAll()
        res.json(records)
    } catch (err) {
        next(err)
    }
})

app.post('/evaluate', async (req, res, next) => {
    try {
        evaluateAllPlays().catch(console.error)
        res.json({
            message: "Plays are evaluating"
        })
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