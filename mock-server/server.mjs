import * as fs from 'fs';
import express from 'express'
const app = express()
const mockData = JSON.parse(fs.readFileSync('./mock-server/mock-data.json', 'utf8'));

app.get('/', (req, res) => {
    try {
        res.json(mockData)

    } catch (err) {
        console.err(err)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Mock Server listening to port ${port}`)
})