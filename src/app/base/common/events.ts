// events for framework
export const enum AppEvents {
    // system
    EvtInitServer = "event_init_server",
    EvtAppReady = "event_app_ready",

    // app
    EvtOkexTicker = "event_okex_ticker",

    // socket io events
    IOEvtOkexTicker = "okex_ticker"
}

export default AppEvents;