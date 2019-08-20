const enum ApiRouters {
    // depracated
    APIOkexTicker = "/api/okex/ticker",
    APIOkexRate = "/api/okex/rate",
    APIOkexBTCRate = "/api/okex/rate/btc",
    APIOkexETHRate = "/api/okex/rate/eth",
    // end depracated

    // okex api
    APIOkexGetTicker = "/api/okex/getTicker",
    APIOkexGetRate = "/api/okex/getRate",

    // token api
    APITokenCount = "/api/token/count",

    // blockchain apis
    APIGetNodeServers = "/api/blockchain/servers"
}

export default ApiRouters;