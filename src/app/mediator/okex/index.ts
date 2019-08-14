import koa = require("koa");
import socketio = require("socket.io");
import koarouter = require("koa-router");
import { Mediator, IFacade, INotification, IObserver, Observer } from "pure-framework";

import AppFacade from "../../App";
import OkexProxy from "../../proxy/okex";
import AppEvents, { NotifictaionEvents } from "../../AppEvents";
import ApiRouters from "../../ApiRouters";
import { OkexETMInstrumentId } from "../../AppConfig";

type InitServerNotificationBody = {
    koa: koa<any, {}>;
    io: socketio.Server;
};

type OkexTickerBody = {
    instrument_id: string;
    last: string;
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

        AppFacade.getInstance().registerObserver(AppEvents.EvtInitServer, this.observer);
        AppFacade.getInstance().registerObserver(AppEvents.EvtOkexTicker, this.observer);
    }

    // public
    async getOkexTicker(ctx: koa.Context): Promise<void> {
        try {
            const result = await this.OkexProxy.getSpotTicker(OkexETMInstrumentId);
            this.response(ctx, result, undefined);
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    // private
    private onNotification(notificaton: INotification) {
        const name = notificaton.getName();
        if (name === AppEvents.EvtInitServer) {
            const body = notificaton.getBody() as InitServerNotificationBody;
            this.io = body.io;
            this.initAPI(body.koa);
        } else if (name === AppEvents.EvtOkexTicker) {
            const body = notificaton.getBody() as OkexTickerBody;
            this.notifyOkexTicker(body);
        }
    }

    private initAPI(koa: koa<any, {}>): void {
        const router = new koarouter();

        router.get(ApiRouters.APIOkexTicker, this.getOkexTicker.bind(this));

        koa.use(router.routes());
    }

    private notifyOkexTicker(body: OkexTickerBody): void {
        // TODO
        console.log("[app] notifyOkexTicker:", body.instrument_id, body.last);
        this.io ? this.io.emit(NotifictaionEvents.NotificationOkexTicker, body) : undefined;
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