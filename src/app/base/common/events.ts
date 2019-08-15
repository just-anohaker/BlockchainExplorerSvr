// events for framework
export const enum AppEvents {
    // system
    EvtInitServer = "event_init_server",
    EvtAppReady = "event_app_ready",

    // app
    EvtOkexTicker = "event_okex_ticker",
    EvtOkexRate = "event_okex_rate",
    EvtOkexBTCRate = "event_okex_btc_rate",
    EvtOkexETHRate = "event_okex_eth_rate",

    // socket io events
    // depracated
    IOEvtOkexTicker = "okex_ticker",
    IOEvtOkexRate = "okex_rate",
    IOEvtOkexBTCRate = "okex_btc_rate",
    IOEvtOkexETHRate = "okex_eth_rate",
    // end depracated

    IOOkexTicker = "/okex/ticker",
    IOOkexRate = "/okex/rate"
}

export default AppEvents;