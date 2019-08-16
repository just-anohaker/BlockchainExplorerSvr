const enum ApiRouters {
    // depracated
    APIOkexTicker = "/api/okex/ticker",
    APIOkexRate = "/api/okex/rate",
    APIOkexBTCRate = "/api/okex/rate/btc",
    APIOkexETHRate = "/api/okex/rate/eth",
    // end depracated

    APIOkexGetTicker = "/api/okex/getTicker",
    APIOkexGetRate = "/api/okex/getRate",
    APITokenCount = "/api/token/count",
}

export default ApiRouters;