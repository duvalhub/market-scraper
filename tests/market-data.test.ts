import { evaluatePlay } from '../src/market-data.js'

describe('Market Data', () => {
    test('find play quality', async () => {
        const mockDate = new Date("2023-02-02 10:45:00")
        const result = await evaluatePlay({
            date: mockDate,
            price: 135.5350,
            ticker: "IBM"
        })
    })
})