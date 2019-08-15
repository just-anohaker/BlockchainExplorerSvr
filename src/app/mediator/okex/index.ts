import koa = require("koa");
import socketio = require("socket.io");
import koarouter = require("koa-router");
import { Mediator, IFacade, INotification, IObserver, Observer } from "pure-framework";

import AppFacade from "../../App";
import OkexProxy from "../../proxy/okex";
import appevents from "../../base/common/events";
import approuters from "../../base/routers";
import { constants } from "../../base/config";
import { NBInitServer, NBOkexTicker, NBOkexRate } from "../../base/common/definitions";

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

        AppFacade.getInstance().registerObserver(appevents.EvtInitServer, this.observer);
        AppFacade.getInstance().registerObserver(appevents.EvtOkexTicker, this.observer);
        AppFacade.getInstance().registerObserver(appevents.EvtOkexRate, this.observer);
    }

    onRemove(): void {
        super.onRemove();

        AppFacade.getInstance().removeObserver(appevents.EvtInitServer, this);
        AppFacade.getInstance().removeObserver(appevents.EvtOkexTicker, this);
        AppFacade.getInstance().removeObserver(appevents.EvtOkexRate, this);
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

    async getOkexRate(ctx: koa.Context): Promise<void> {
        try {
            const result = await this.OkexProxy.getRate();
            this.response(ctx, result, undefined);
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    // private
    private onNotification(notification: INotification) {
        const name = notification.getName();
        if (name === appevents.EvtInitServer) {
            const body = notification.getBody() as NBInitServer;
            this.io = body.io;
            this.initAPI(body.koa);
        } else if (name === appevents.EvtOkexTicker) {
            const body = notification.getBody() as NBOkexTicker;
            this.notifyOkexTicker(body);
        } else if (name === appevents.EvtOkexRate) {
            const body = notification.getBody() as NBOkexRate;
            this.notifyOkexRate(body);
        }
    }

    private initAPI(koa: koa<any, {}>): void {
        const router = new koarouter();

        /// routes
        router.get(approuters.APIOkexTicker, this.getOkexTicker.bind(this));
        router.get(approuters.APIOkexRate, this.getOkexRate.bind(this));

        koa.use(router.routes());
    }

    private notifyOkexTicker(body: NBOkexTicker): void {
        // TODO
        console.log("[app] notifyOkexTicker:", body.instrument_id, body.last);
        this.io ? this.io.emit(appevents.IOEvtOkexTicker, body) : undefined;
    }

    private notifyOkexRate(body: NBOkexRate): void {
        // TODO
        console.log("[app] notifyOkexRate:", body.rate);
        this.io ? this.io.emit(appevents.IOEvtOkexRate, body) : undefined;
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