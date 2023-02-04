// NOTES: Questrade provides an API which could be use to retrieve market data at request time
// https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-quotes-id

import axios from 'axios';
import { parse } from 'csv-parse';
import { config } from 'dotenv';
import Stream from 'stream';
import { Play, PlayEvaluation, TypeQuality } from "./model.js";
import { getUnfinishedPlays } from './posts.js';
config()

const apikey = process.env.ALPHA_VANTAGE_API_KEY
const apiUrl = process.env.ALPHA_VANTAGE_URL
const MS_PER_DAY = 1000 * 60 * 60 * 24
const EXIT_PERCENT = 1 - 0.2

export const evaluateAllPlays = async () => {
    const playsToFinish = await getUnfinishedPlays()
    console.log(`There is ${playsToFinish.length} play to evaluate`)
    while (playsToFinish.length > 0) {
        await Promise.all(playsToFinish.splice(0, 5).map(async (play) => {
            console.log(`Evaluating play '${play.message?.slice(0, 50)}'`)
            const playEvaluation = await evaluatePlay(play)
            if (playEvaluation?.price) {
                console.log(`Updating play ${play.id} with:`, playEvaluation)
                await play.update({
                    quality: playEvaluation.quality,
                    bestPrice: playEvaluation.price,
                    bestPricePercent: playEvaluation.percentChange,
                    bestDate: playEvaluation.date
                })
            }
        }))
    }
}

export const evaluatePlay = async (play: Play): Promise<PlayEvaluation> => {
    const {
        ticker,
        date,
        price
    } = play
    const params = {
        function: "TIME_SERIES_INTRADAY",
        symbol: ticker,
        interval: "5min",
        apikey,
        datatype: "csv",
        outputsize: outputSize(date),
        adjusted: false
    }

    try {
        const response = await axios.get(apiUrl, {
            params, responseType: 'stream'
        })
        if (response.status === 200) {
            const stream = await response.data
                .pipe(
                    parse({ relax_quotes: true, delimiter: ",", from_line: 2 })
                )
            const evaluator = createPlayEvaluator(play)
            const bestMatch = await evaluator(stream)
            bestMatch.percentChange = Number((100 * price / bestMatch.price).toFixed(4))
            return bestMatch
        } else {
            throw Error(`Failed to retrieve data due to: ${response.data}`)
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

function outputSize(date: Date): string {
    const maxDate = new Date(date.valueOf() + MS_PER_DAY)
    const now = new Date()
    return now < maxDate ? "compact" : "full"
}

function calculateQuality(referencePrice: number, price: number): TypeQuality {
    const percentDifference = price / referencePrice - 1
    switch (true) {
        case percentDifference > 3:
            return TypeQuality.AAAAAA
        case percentDifference > 0.3:
            return TypeQuality.AAAAA
        case percentDifference > 0.25:
            return TypeQuality.AAAA
        case percentDifference > 0.2:
            return TypeQuality.AAA
        case percentDifference > 0.15:
            return TypeQuality.AA
        case percentDifference > 0:
            return TypeQuality.A
        default:
            return TypeQuality.F
    }
}

function isStopLoss(referencePrice: number, currentPrice: number): boolean {
    return currentPrice < referencePrice * EXIT_PERCENT
}

function evaluate(result, row, play) {
    const [
        timestamp,
        open,
    ] = row
    const { date, price } = play
    const sampleDate = new Date(timestamp)
    if (sampleDate >= date) {
        const currentPrice = Number(open)
        if (isStopLoss(price, currentPrice)) {
            result = {
                quality: TypeQuality.F,
                price: currentPrice,
                date: sampleDate,
                row
            }
        } else {
            if (!result.price || currentPrice > result.price) {
                const currentQuality = calculateQuality(price, currentPrice)
                result = {
                    quality: currentQuality,
                    price: currentPrice,
                    date: sampleDate,
                    row
                }
            }
        }
    }
    return result
}
function createPlayEvaluator(play: Play): (stream: Stream) => Promise<PlayEvaluation> {
    let result = {
        quality: undefined,
        price: undefined,
        date: undefined,
        row: undefined
    }
    return (stream) => {
        return new Promise((resolve, reject) => {
            stream.on('data', (row) => result = evaluate(result, row, play))
            stream.on('end', () => resolve(result))
            stream.on('error', reject)
        })
    }
}


// const ticker = "RBOT"
// const url = `https://www.alphavantage.co/query`
// let params = {
//   function: "TIME_SERIES_INTRADAY",
//   symbol: ticker,
//   interval: "60min",
//   apikey: apikey,
//   adjusted: true
// }

// params.function = "TIME_SERIES_INTRADAY_EXTENDED"
// params.slice = "year2month6"

// // params.alphaFunction = "TIME_SERIES_WEEKLY"

// axios.get(url, { params }).then(response => {
//   if (response.status === 200) {
//     fs.writeFileSync(`${ticker}-${params.function}${params.slice ? `-${params.slice}` : ''}.json`, JSON.stringify(response.data))
//   } else {
//     console.error(response)
//   }
// })


