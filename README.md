
# Stockwiths API
Request post: 
```js
let url = new URL(`https://api.stocktwits.com/api/2/streams/user/${USER}.json`)
let queries = {
    filter: "all",
    limit: 21,
    max: 12345
}
```

Request details of a post with prices for stock in post: 
```js
let url = new URL(`https://api.stocktwits.com/api/2/messages/${MESSAGE_ID}/conversation.json?limit=21`)
```

Received message "$RBOT chart looks good"


# [Alpha Vantage API](https://www.alphavantage.co/documentation/) for Market Data
## Intraday
Retrieve the last 1-2 months of data split

```bash
$ curl -o intraday.csv "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=$(pass alphavantage/apikey)&datatype=csv&outputsize=full&adjusted=false"

timestamp,open,high,low,close,volume
2023-02-01 20:00:00,135.2500,135.2500,135.2500,135.2500,131
2023-02-01 19:55:00,135.2500,135.2500,135.2500,135.2500,125
2023-02-01 19:45:00,135.2500,135.2500,135.2500,135.2500,501
2023-02-01 19:25:00,135.2500,135.2500,135.1400,135.1400,923
2023-02-01 19:20:00,135.2500,135.2500,135.2500,135.2500,509
[....]
2023-01-04 08:05:00,141.6500,141.6500,141.6500,141.6500,186
2023-01-04 07:55:00,141.8800,141.8800,141.8800,141.8800,320
2023-01-04 07:50:00,141.9000,141.9000,141.8800,141.8800,1658
2023-01-04 07:30:00,141.8800,141.8800,141.8800,141.8800,111
2023-01-04 05:20:00,141.9200,141.9200,141.9200,141.9200,128
```

## Intraday Extended
Retrieve the 2 years of data

```bash
$ curl  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=IBM&interval=5min&apikey=$(pass alphavantage/apikey)&slice=year1month1&adjusted=false"

time,open,high,low,close,volume
2023-02-01 20:00:00,135.25,135.25,135.25,135.25,131
2023-02-01 19:55:00,135.25,135.25,135.25,135.25,125
2023-02-01 19:45:00,135.25,135.25,135.25,135.25,501
2023-02-01 19:25:00,135.25,135.25,135.14,135.14,923
2023-02-01 19:20:00,135.25,135.25,135.25,135.25,509
[...]
2023-01-03 09:00:00,141.26,141.26,141.26,141.26,100
2023-01-03 08:05:00,141.25,141.25,141.25,141.25,518
2023-01-03 08:00:00,141.25,141.25,141.25,141.25,268
2023-01-03 05:25:00,141.75,141.75,141.75,141.75,200
2023-01-03 04:50:00,141.53,141.68,141.53,141.68,340
```

## Daily
Retrieve the last 20+ years of daily data (date, daily open, daily high, daily low, daily close, daily volume)

```bash
$ curl -o daily.csv "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&interval=5min&apikey=$(pass alphavantage/apikey)&outputsize=full&datatype=csv" 

timestamp,open,high,low,close,adjusted_close,volume,dividend_amount,split_coefficient
2023-02-01,134.49,135.79,132.8,135.09,135.09,5428898,0.0000,1.0
2023-01-31,135.5,135.65,133.76,134.73,134.73,7206448,0.0000,1.0
2023-01-30,134.32,136.11,133.98,135.3,135.3,5375712,0.0000,1.0
2023-01-27,134.44,135.488,133.7701,134.39,134.39,8143146,0.0000,1.0
2023-01-26,137.53,138.27,132.98,134.45,134.45,17548483,0.0000,1.0
[...]
1999-11-05,92.75,92.94,90.19,90.25,49.7287816698025,13737600,0.0000,1.0
1999-11-04,94.44,94.44,90.0,91.56,50.4506066447326,16697600,0.0000,1.0
1999-11-03,95.87,95.94,93.5,94.37,51.9989487665292,10369100,0.0000,1.0
1999-11-02,96.75,96.81,93.69,94.81,52.2413937962767,11105400,0.0000,1.0
1999-11-01,98.5,98.81,96.37,96.75,53.3103559728907,9551800,0.0000,1.0
```

## Quote
Return the current price and volume of a ticker

```bash
curl -o quote.csv  "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=$(pass alphavantage/apikey)&datatype=csv"

symbol,open,high,low,price,volume,latestDay,previousClose,change,changePercent
IBM,134.4900,135.7900,132.8000,135.0900,5428898,2023-02-01,134.7300,0.3600,0.2672%
```