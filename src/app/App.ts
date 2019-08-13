import { Facade, IFacade } from "pure-framework";

/// mediators
import OkexMediator from "./mediator/okex";
/// proxies
import OkexProxy from "./proxy/okex";
/// observers

import koa = require("koa");
import socketio = require("socket.io");

class AppFacade extends Facade implements IFacade {
    private static instance?: AppFacade;

    static getInstance(): AppFacade {
        if (AppFacade.instance === undefined) {
            const appFacade = new AppFacade();
            AppFacade.instance = appFacade;
            appFacade.initializeObservers();
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

    private initializeObservers(): void {

    }

    initServer(koa: koa<any, {}>, io: socketio.Server): void {
        this.sendNotification("evt_init_server", { koa, io });
    }
}

export default AppFacade;