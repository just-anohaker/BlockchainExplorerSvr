import { Facade, IFacade } from "pure-framework";
import koa = require("koa");
import socketio = require("socket.io");

import events from "./base/common/events";

/// mediators
import OkexMediator from "./mediator/okex";
/// proxies
import OkexProxy from "./proxy/okex";

class AppFacade extends Facade implements IFacade {
    private static instance?: AppFacade;

    static getInstance(): AppFacade {
        if (AppFacade.instance === undefined) {
            const appFacade = new AppFacade();
            AppFacade.instance = appFacade;
            appFacade.initializeProxies();
            appFacade.initializeMediators();
        }
        return AppFacade.instance;
    }

    constructor() {
        super();
    }

    private initializeMediators(): void {
        this.registerMediator(new OkexMediator(this));
    }

    private initializeProxies(): void {
        this.registerProxy(new OkexProxy(this));
    }

    initServer(koa: koa<any, {}>, io: socketio.Server): void {
        this.sendNotification(events.EvtInitServer, { koa, io });
    }

    appReady(): void {
        this.sendNotification(events.EvtAppReady);
    }
}

export default AppFacade;