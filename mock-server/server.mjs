import * as fs from 'fs';
import express from 'express'
const app = express()
const mockData = JSON.parse(fs.readFileSync('./mock-server/alejos.json', 'utf8'));

app.get('/stockwits', (req, res) => {
    try {
        res.json(mockData)

    } catch (err) {
        console.err(err)
    }
})

app.get('/alphavantage', (req, res) => {
    try {
        fs.createReadStream("./mock-server/alpha-vantage.csv").pipe(res);
    } catch (err) {
        console.err(err)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Mock Server listening to port ${port}`)
})