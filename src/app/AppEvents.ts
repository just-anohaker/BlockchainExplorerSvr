// events for framework
const enum AppEvents {
    // system
    EvtInitServer = "event_init_server",
    EvtAppReady = "event_app_ready",

    // app
    EvtOkexTicker = "event_okex_ticker"
}

// events for socketio
export const enum NotifictaionEvents {
    NotificationOkexTicker = "okex_ticker",
}

export default AppEvents;