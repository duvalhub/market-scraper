// NOTES: Questrade provides an API which could be use to retrieve market data at request time
// https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-quotes-id

import axios from 'axios';
import { parse } from 'csv-parse';
import Stream from 'stream';
import { configs } from './config.js';
import { Play, PlayEvaluation, TypeQuality } from "./model.js";
import { getUnfinishedPlays } from './posts.js';

const { PLAY_EXPIRED_HOURS, ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_URL, STOP_LOSS_PERCENT } = configs
const MS_PER_DAY = 1000 * 60 * 60 * 24
const EXIT_PERCENT = 1 - STOP_LOSS_PERCENT
const PLAY_EXPIRED_MS = PLAY_EXPIRED_HOURS * 60 * 60 * 1000 // H * M/H * S/M * MS/S
const ALPHA_VANTAGE_API_RESET = 60 * 1000 // AV limit is 5 call per minute

export const evaluateAllPlays = async () => {
    const playsToFinish = await getUnfinishedPlays()
    console.log(`There are ${playsToFinish.length} plays to evaluate`)
    while (playsToFinish.length) {
        await Promise.all(playsToFinish.splice(0, 5).map(async (play) => {
            console.log(`Evaluating play ${play.id} - '${play.message?.slice(0, 50)}'`)
            const playEvaluation = await evaluatePlay(play)
            if (playEvaluation?.price) {
                console.log(`Updating play ${play.id} with:`, playEvaluation)
                await play.update({
                    quality: playEvaluation.quality,
                    bestPrice: playEvaluation.price,
                    bestPricePercent: playEvaluation.percentChange,
                    bestDate: playEvaluation.date,
                    isClosed: playEvaluation.isClosed
                })
            } else {
                console.log(`Play ${play.id} unchanged`)
            }
        }))
        if (playsToFinish.length) {
            await new Promise(res => {
                console.log(`Waiting ${ALPHA_VANTAGE_API_RESET}ms to release call limit...`)
                setTimeout(res, ALPHA_VANTAGE_API_RESET)
            })
        }
    }
    console.log("All plays were evaluated")
}

export const evaluatePlay = async (play: Play): Promise<PlayEvaluation> => {
    const {
        ticker,
        date,
        price
    } = play
    try {
        const response = await axios.get(ALPHA_VANTAGE_URL, {
            params: {
                function: "TIME_SERIES_INTRADAY",
                symbol: ticker,
                interval: "5min",
                apikey: ALPHA_VANTAGE_API_KEY,
                datatype: "csv",
                outputsize: outputSize(date),
                adjusted: false
            }, responseType: 'stream'
        })
        if (response.status === 200) {
            const stream = await response.data
                .pipe(
                    parse({ relax_quotes: true, delimiter: ",", from_line: 2 })
                )
            const bestMatch = await createPlayEvaluator(play)(stream)
            const percentChange = bestMatch.price / price - 1
            bestMatch.percentChange = Number((percentChange * 100).toFixed(4))
            bestMatch.isClosed = isPlayExpired(play)
            return bestMatch
        } else {
            throw Error(`Failed to retrieve data due to: ${response.data}`)
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

function createPlayEvaluator(play: Play): (stream: Stream) => Promise<PlayEvaluation> {
    let result: PlayEvaluation = {
        quality: undefined,
        price: undefined,
        date: undefined,
        row: undefined,
        isClosed: false
    }
    return (stream) => {
        return new Promise((resolve, reject) => {
            stream.on('data', (row) => result = evaluate(result, row, play))
            stream.on('end', () => resolve(result))
            stream.on('error', reject)
        })
    }
}

function evaluate(result, row, play): PlayEvaluation {
    const [
        timestamp,
        open,
    ] = row
    const event = {
        date: new Date(timestamp),
        price: Number(open)
    }
    if (isEventPertinent(play, event.date)) {
        result = evaluateEvent(event, result, play)
    }
    return result
}

function isEventPertinent(play: Play, eventDate: Date): boolean {
    return eventDate >= play.date
}

function evaluateEvent(event: { date: Date, price: number }, result: PlayEvaluation, play: Play): PlayEvaluation {
    const { date, price } = event
    if (isStopLoss(play.price, price)) {
        result = {
            ...result,
            quality: TypeQuality.F,
            price: price,
            date: date,
            isClosed: true
        }
    } else if (!result.price || price > result.price) {
        const currentQuality = calculateQuality(play, price)
        result = {
            ...result,
            quality: currentQuality,
            price: price,
            date: date,
            isClosed: false
        }
    }
    return result
}

function calculateQuality(play: Play, price: number): TypeQuality {
    const playPrice = play.price
    const percentDifference = price / playPrice - 1
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

function outputSize(date: Date): string {
    const maxDate = new Date(date.valueOf() + MS_PER_DAY)
    const now = new Date()
    return now < maxDate ? "compact" : "full"
}

function isStopLoss(referencePrice: number, currentPrice: number): boolean {
    return currentPrice < referencePrice * EXIT_PERCENT
}


function isPlayExpired(play: Play): boolean {
    const now = new Date()
    const playDate = play.date
    const expireDate = new Date(playDate.valueOf() + PLAY_EXPIRED_MS)
    return now > expireDate
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


