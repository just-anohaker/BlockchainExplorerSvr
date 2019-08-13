import Mediator from "../../../patterns/mediator/Mediator";
import IFacade from "../../../interfaces/IFacade";
import AppFacade from "../../App";
import INotification from "../../../interfaces/INotification";

import koa = require("koa");
import socketio = require("socket.io");
import koarouter = require("koa-router");
import Observer from "../../../patterns/observer/Observer";
import IObserver from "../../../interfaces/IObserver";
import OkexProxy from "../../proxy/okex";

type InitServerNotificationBody = {
    koa: koa<any, {}>;
    io: socketio.Server;
};

type OkexTickerBody = {
    instrument_id: string;
    price: string;
};

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

        AppFacade.getInstance().registerObserver("evt_init_server", this.observer);
        AppFacade.getInstance().registerObserver("evt_okex_ticker", this.observer);
    }

    // public
    async getOkexTicker(ctx: koa.Context): Promise<void> {
        try {
            const result = await this.OkexProxy.getSpotTicker("ETM-USDT");
            this.response(ctx, result, undefined);
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    // private
    private onNotification(notificaton: INotification) {
        const name = notificaton.getName();
        if (name === "evt_init_server") {
            const body = notificaton.getBody() as InitServerNotificationBody;
            this.io = body.io;
            this.initAPI(body.koa);
        } else if (name === "evt_okex_ticker") {
            const body = notificaton.getBody() as OkexTickerBody;
            this.notifyOkexTicker(body);
        }
    }

    private initAPI(koa: koa<any, {}>): void {
        const router = new koarouter();

        router.get("/api/okex/ticker", this.getOkexTicker.bind(this));

        koa.use(router.routes());
    }

    private notifyOkexTicker(body: OkexTickerBody): void {
        // TODO
        console.log("notifyOkexTicker:", body);
        this.io ? this.io.emit("okex_ticker", body) : undefined;
    }

    private response(ctx: koa.Context, body?: any, error?: string): void {
        if (body) {
            ctx.body = { success: true, data: body };

            return;
        }

        ctx.body = { success: false, error };
    }

    private get OkexProxy(): OkexProxy {
        return AppFacade.getInstance().retrieveProxy(OkexProxy.TagName);
    }
}

export default OkexMediator;