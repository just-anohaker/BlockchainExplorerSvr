import koa = require("koa");
import socketio = require("socket.io");
import { Facade, IFacade } from "pure-framework";

import appevents from "../base/common/events";

/// mediators
import OkexMediator from "../mediator/okex";
import TokenMediator from "../mediator/token";
import BlockchainMediator from "../mediator/blockchain";
/// proxies
import OkexProxy from "../proxy/okex";
import BlockchainProxy from "../proxy/blockchain";

class AppFacade extends Facade implements IFacade {
    private static instance?: AppFacade;

    static getInstance(): AppFacade {
        if (AppFacade.instance === undefined) {
            const appFacade = new AppFacade();
            AppFacade.instance = appFacade;
            appFacade.registerProxies();
            appFacade.registerMediators();
        }
        return AppFacade.instance;
    }

    private constructor() {
        super();
    }

    private registerMediators(): void {
        this.registerMediator(new OkexMediator(this));
        this.registerMediator(new TokenMediator(this));
        this.registerMediator(new BlockchainMediator(this));
    }

    private registerProxies(): void {
        this.registerProxy(new OkexProxy(this));
        this.registerProxy(new BlockchainProxy(this));
    }

    initServer(koa: koa<any, {}>, io: socketio.Server): void {
        this.sendNotification(appevents.EvtInitServer, { koa, io });
    }

    appReady(): void {
        this.sendNotification(appevents.EvtAppReady);
    }
}

export default AppFacade;