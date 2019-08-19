import koa = require("koa");
import socketio = require("socket.io");
import koarouter = require("koa-router");
import { Mediator, IFacade, INotification, IObserver, Observer } from "pure-framework";

import appevents from "../../base/common/events";
import approuters from "../../base/routers";
import { NBInitServer, NBBlockChange } from "../../base/common/definitions";

class BlockchainMediator extends Mediator {
    static TagName: string = "BlockchainMediator";

    private io?: socketio.Server;
    private observer: IObserver;

    constructor(facade: IFacade) {
        super(BlockchainMediator.TagName, facade);
        this.observer = new Observer(this.onNotification, this);
    }

    // overwrite
    onRegister(): void {
        super.onRegister();

        this.facade.registerObserver(appevents.EvtInitServer, this.observer);
        this.facade.registerObserver(appevents.EvtBlocksChange, this.observer);
    }

    // overwrite
    onRemove(): void {
        super.onRemove();

        this.facade.removeObserver(appevents.EvtInitServer, this);
    }

    // public
    // async getTokenCount(ctx: koa.Context): Promise<void> {
    //     this.response(ctx, { tokenName: "ETM", tokenCount: config.TokenCount }, undefined);
    // }

    // private
    // private initAPI(koa: koa<any, {}>): void {
    //     const router = new koarouter();

    //     /// routes
    //     // router.get(approuters.APITokenCount, this.getTokenCount.bind(this));

    //     koa.use(router.routes());
    // }

    // notifications
    private onNotification(notification: INotification) {
        const name = notification.getName();
        if (name === appevents.EvtInitServer) {
            const body = notification.getBody() as NBInitServer;
            this.io = body.io;
            // this.initAPI(body.koa);
        } else if (name === appevents.EvtBlocksChange) {
            const body = notification.getBody() as NBBlockChange;
            this.notifyBlocksChange(body);
        }
    }

    private notifyBlocksChange(body: NBBlockChange): void {
        console.log("[app] notifyBlocksChange:", JSON.stringify(body));
        this.io ? this.io.emit(appevents.IOBlocksChange, body) : undefined;
    }

    // helpers
    private response(ctx: koa.Context, body?: any, error?: string): void {
        ctx.body = body
            ? { success: true, data: body }
            : { success: false, error };
    }
}

export default BlockchainMediator;