// events for framework
export const enum AppEvents {
    // system
    EvtInitServer = "event_init_server",
    EvtAppReady = "event_app_ready",

    // app
    EvtOkexTicker = "event_okex_ticker",
    EvtOkexRate = "event_okex_rate",

    // socket io events
    IOEvtOkexTicker = "okex_ticker",
    IOEvtOkexRate = "okex_rate"
}

export default AppEvents;