import koa = require("koa");
import socketio = require("socket.io");
import koarouter = require("koa-router");
import { Mediator, IFacade, INotification, IObserver, Observer } from "pure-framework";

import AppFacade from "../../App";
import OkexProxy from "../../proxy/okex";
import { AppEvents, NotificationNames } from "../../base/common/events";
import ApiRouters from "../../base/routers";
import { constants } from "../../base/config";
import { NBInitServer, NBOkexTicker } from "../../base/common/definitions";

class OkexMediator extends Mediator {
    static TagName: string = "OkexMediator";

    private io?: socketio.Server;
    private observer: IObserver;

    constructor(facade: IFacade) {
        super(OkexMediator.TagName, facade);
        this.observer = new Observer(this.onNotification, this);
    }

    onRegister(): void {
        super.onRegister();

        AppFacade.getInstance().registerObserver(AppEvents.EvtInitServer, this.observer);
        AppFacade.getInstance().registerObserver(AppEvents.EvtOkexTicker, this.observer);
    }

    // public
    async getOkexTicker(ctx: koa.Context): Promise<void> {
        try {
            const result = await this.OkexProxy.getSpotTicker(constants.cOkexETMInstrumentId);
            this.response(ctx, result, undefined);
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    // private
    private onNotification(notificaton: INotification) {
        const name = notificaton.getName();
        if (name === AppEvents.EvtInitServer) {
            const body = notificaton.getBody() as NBInitServer;
            this.io = body.io;
            this.initAPI(body.koa);
        } else if (name === AppEvents.EvtOkexTicker) {
            const body = notificaton.getBody() as NBOkexTicker;
            this.notifyOkexTicker(body);
        }
    }

    private initAPI(koa: koa<any, {}>): void {
        const router = new koarouter();

        /// routes
        router.get(ApiRouters.APIOkexTicker, this.getOkexTicker.bind(this));

        koa.use(router.routes());
    }

    private notifyOkexTicker(body: NBOkexTicker): void {
        // TODO
        console.log("[app] notifyOkexTicker:", body.instrument_id, body.last);
        this.io ? this.io.emit(NotificationNames.NNOkexTicker, body) : undefined;
    }

    private response(ctx: koa.Context, body?: any, error?: string): void {
        if (body) {
            ctx.body = { success: true, data: body };
            return;
        }
        ctx.body = { success: false, error };
    }

    private get OkexProxy(): OkexProxy {
        return AppFacade.getInstance().retrieveProxy(OkexProxy.TagName)! as OkexProxy;
    }
}

export default OkexMediator;