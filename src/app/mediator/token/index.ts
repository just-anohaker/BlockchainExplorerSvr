import koa = require("koa");
import koarouter = require("koa-router");
import { Mediator, IFacade, INotification, IObserver, Observer } from "pure-framework";

import appevents from "../../base/common/events";
import approuters from "../../base/routers";
import { NBInitServer } from "../../base/common/definitions";
import config from "../../base/config";

class TokenMediator extends Mediator {
    static TagName: string = "TokenMediator";

    private observer: IObserver;

    constructor(facade: IFacade) {
        super(TokenMediator.TagName, facade);
        this.observer = new Observer(this.onNotification, this);
    }

    // overwrite
    onRegister(): void {
        super.onRegister();

        this.facade.registerObserver(appevents.EvtInitServer, this.observer);
    }

    // overwrite
    onRemove(): void {
        super.onRemove();

        this.facade.removeObserver(appevents.EvtInitServer, this);
    }

    // public
    async getTokenCount(ctx: koa.Context): Promise<void> {
        this.response(ctx, { tokenName: "ETM", tokenCount: config.TokenCount }, undefined);
    }

    // private
    private initAPI(koa: koa<any, {}>): void {
        const router = new koarouter();

        /// routes
        router.get(approuters.APITokenCount, this.getTokenCount.bind(this));

        koa.use(router.routes());
    }

    // notifications
    private onNotification(notification: INotification) {
        const name = notification.getName();
        if (name === appevents.EvtInitServer) {
            const body = notification.getBody() as NBInitServer;
            this.initAPI(body.koa);
        }
    }

    // helpers
    private response(ctx: koa.Context, body?: any, error?: string): void {
        ctx.body = body
            ? { success: true, data: body }
            : { success: false, error };
    }
}

export default TokenMediator;