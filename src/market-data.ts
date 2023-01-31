// NOTES: Questrade provides an API which could be use to retrieve market data at request time
// https://www.questrade.com/api/documentation/rest-operations/market-calls/markets-quotes-id


// // import { MarketDataRequest } from "./model";
// // import * as fs from 'fs'
// const fs = require('fs')

// var axios = require('axios');
// var apikey = process.env.ALPHA_VANTAGE_API_KEY


// const requestMarketData = async (request) => {
//   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${request.ticker}&interval=60min&apikey=${apikey}`;

//   const response = await axios.get(url)

//   if (response.status === 200) {
//     return response.data
//   } else {
//     throw Error(`Failed to retrieve data due to: ${response.data}`)
//   }
// }
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


