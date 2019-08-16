import koa = require("koa");
import socketio = require("socket.io");
import koarouter = require("koa-router");
import { Big } from "big.js";
import { Mediator, IFacade, INotification, IObserver, Observer } from "pure-framework";

import AppFacade from "../../App";
import OkexProxy from "../../proxy/okex";
import appevents from "../../base/common/events";
import approuters from "../../base/routers";
import { constants } from "../../base/config";
import { NBInitServer, NBOkexTicker, NBOkexRate } from "../../base/common/definitions";

const instrument2rate = function (last: string): string {
    const rate = new Big("1").div(last);
    return rate.toString();
}

class OkexMediator extends Mediator {
    static TagName: string = "OkexMediator";

    private io?: socketio.Server;
    private observer: IObserver;

    constructor(facade: IFacade) {
        super(OkexMediator.TagName, facade);
        this.observer = new Observer(this.onNotification, this);
    }

    // overwrite
    onRegister(): void {
        super.onRegister();

        AppFacade.getInstance().registerObserver(appevents.EvtInitServer, this.observer);
        AppFacade.getInstance().registerObserver(appevents.EvtOkexTicker, this.observer);
        AppFacade.getInstance().registerObserver(appevents.EvtOkexRate, this.observer);
        AppFacade.getInstance().registerObserver(appevents.EvtOkexBTCRate, this.observer);
        AppFacade.getInstance().registerObserver(appevents.EvtOkexETHRate, this.observer);
    }

    // overwrite
    onRemove(): void {
        super.onRemove();

        AppFacade.getInstance().removeObserver(appevents.EvtInitServer, this);
        AppFacade.getInstance().removeObserver(appevents.EvtOkexTicker, this);
        AppFacade.getInstance().removeObserver(appevents.EvtOkexRate, this);
        AppFacade.getInstance().removeObserver(appevents.EvtOkexBTCRate, this);
        AppFacade.getInstance().removeObserver(appevents.EvtOkexETHRate, this);
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

    async getOkexBTCRate(ctx: koa.Context): Promise<void> {
        try {
            const result = await this.OkexProxy.getSpotTicker(constants.cOkexBTCInstrumentId);
            this.response(ctx, { rate: instrument2rate(result.last) }, undefined);
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    async getOkexETHRate(ctx: koa.Context): Promise<void> {
        try {
            const result = await this.OkexProxy.getSpotTicker(constants.cOkexETHInstrumentId);
            this.response(ctx, { rate: instrument2rate(result.last) }, undefined);
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    async getTicker(ctx: koa.Context): Promise<void> {
        const arg: string = (ctx.query.instrumentId || constants.cOkexETMInstrumentId);
        const instrumentId = arg.trim().toUpperCase();
        const validators: string[] = [
            constants.cOkexETMInstrumentId,
            constants.cOkexBTCInstrumentId,
            constants.cOkexETHInstrumentId
        ];
        if (!validators.includes(instrumentId)) {
            return this.response(ctx, undefined, `Unsupported instrumentId(${instrumentId})`);
        }

        try {
            const result = await this.OkexProxy.getSpotTicker(instrumentId.trim().toUpperCase());
            this.response(ctx, { instrumentId, data: result });
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    async getRate(ctx: koa.Context): Promise<void> {
        const arg = (ctx.query.currencyName || constants.cOkexCurrencyCNY);
        const currencyName = arg.trim().toUpperCase();
        const validators: string[] = [
            constants.cOkexCurrencyCNY,
            constants.cOkexCurrencyBTC,
            constants.cOkexCurrencyETH
        ];
        if (!validators.includes(currencyName)) {
            this.response(ctx, undefined, `Unsupported currencyName(${currencyName})`);
            return;
        }

        try {
            if (currencyName === constants.cOkexCurrencyCNY) {
                const result = await this.OkexProxy.getRate();
                this.response(ctx, { currencyName, data: result }, undefined);
            } else {
                const result = await this.OkexProxy.getSpotTicker(`${currencyName}-USDT`);
                this.response(ctx, { currencyName, data: { rate: instrument2rate(result.last) } }, undefined);
            }
        } catch (error) {
            this.response(ctx, undefined, error.toString());
        }
    }

    // private
    private initAPI(koa: koa<any, {}>): void {
        const router = new koarouter();

        /// routes
        // depracated
        router.get(approuters.APIOkexTicker, this.getOkexTicker.bind(this));
        router.get(approuters.APIOkexRate, this.getOkexRate.bind(this));
        router.get(approuters.APIOkexBTCRate, this.getOkexBTCRate.bind(this));
        router.get(approuters.APIOkexETHRate, this.getOkexETHRate.bind(this));
        // end depracated

        router.get(approuters.APIOkexGetTicker, this.getTicker.bind(this));
        router.get(approuters.APIOkexGetRate, this.getRate.bind(this));

        koa.use(router.routes());
    }

    // notifications
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
        } else if (name === appevents.EvtOkexBTCRate) {
            const body = notification.getBody() as NBOkexTicker;
            this.notifyOkexBTCRate(body);
        } else if (name === appevents.EvtOkexETHRate) {
            const body = notification.getBody() as NBOkexTicker;
            this.notifyOkexETHRate(body);
        }
    }

    // socketio event notifications
    private notifyOkexTicker(body: NBOkexTicker): void {
        // TODO
        console.log("[app] notifyOkexTicker:", body.instrument_id, body.last);
        this.io
            ? this.io.emit(appevents.IOEvtOkexTicker, body)
            : undefined;
        this.io
            ? this.io.emit(appevents.IOOkexTicker, body)
            : undefined;
    }


    private notifyOkexRate(body: NBOkexRate): void {
        // TODO
        console.log("[app] notifyOkexRate:", body.rate);
        this.io
            ? this.io.emit(appevents.IOEvtOkexRate, body)
            : undefined;
        const emitData = {
            currencyName: constants.cOkexCurrencyCNY,
            data: body
        };
        this.io
            ? this.io.emit(appevents.IOOkexRate, emitData)
            : undefined;
    }

    private notifyOkexBTCRate(body: NBOkexTicker): void {
        // TODO
        console.log("[app] notifyOkexBTCRate:", body.last, instrument2rate(body.last));
        this.io
            ? this.io.emit(appevents.IOEvtOkexBTCRate, { rate: instrument2rate(body.last) })
            : undefined;
        const emitData = {
            currencyName: constants.cOkexCurrencyBTC,
            data: { rate: instrument2rate(body.last) }
        };
        this.io
            ? this.io.emit(appevents.IOOkexRate, emitData)
            : undefined;
    }

    private notifyOkexETHRate(body: NBOkexTicker): void {
        // TODO
        console.log("[app] notifyOkexETHRate:", body.last, instrument2rate(body.last));
        this.io
            ? this.io.emit(appevents.IOEvtOkexETHRate, { rate: instrument2rate(body.last) })
            : undefined;
        const emitData = {
            currencyName: constants.cOkexCurrencyETH,
            data: { rate: instrument2rate(body.last) }
        };
        this.io
            ? this.io.emit(appevents.IOOkexRate, emitData)
            : undefined;
    }

    // helpers
    private response(ctx: koa.Context, body?: any, error?: string): void {
        ctx.body = body
            ? { success: true, data: body }
            : { success: false, error };
    }

    private get OkexProxy(): OkexProxy {
        return AppFacade.getInstance().retrieveProxy(OkexProxy.TagName)! as OkexProxy;
    }
}

export default OkexMediator;