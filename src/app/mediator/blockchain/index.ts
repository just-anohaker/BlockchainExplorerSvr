import koa = require("koa");
import socketio = require("socket.io");
import koarouter = require("koa-router");
import { Mediator, IFacade, INotification, IObserver, Observer } from "pure-framework";

import appevents from "../../base/common/events";
import approuters from "../../base/routers";
import config from "../../base/config";
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
        this.facade.registerObserver(appevents.EvtRoundChange, this.observer);
    }

    // overwrite
    onRemove(): void {
        this.facade.removeObserver(appevents.EvtRoundChange, this);
        this.facade.removeObserver(appevents.EvtBlocksChange, this);
        this.facade.removeObserver(appevents.EvtInitServer, this);

        super.onRemove();
    }

    // public
    async getNodeServers(ctx: koa.Context): Promise<void> {
        this.response(ctx, { servers: [config.ETMServer] }, undefined);
    }

    // private
    private initAPI(koa: koa<any, {}>): void {
        const router = new koarouter();

        /// routes
        router.get(approuters.APIGetNodeServers, this.getNodeServers.bind(this));

        koa.use(router.routes());
    }

    // notifications
    private onNotification(notification: INotification) {
        const name = notification.getName();
        if (name === appevents.EvtInitServer) {
            const body = notification.getBody() as NBInitServer;
            this.io = body.io;
            this.initAPI(body.koa);
        } else if (name === appevents.EvtBlocksChange) {
            const body = notification.getBody() as NBBlockChange;
            this.notifyBlocksChange(body);
        } else if (name === appevents.EvtRoundChange) {
            const body = notification.getBody() as any;
            this.notifyRoundChange(body);
        }
    }

    private notifyBlocksChange(body: NBBlockChange): void {
        console.log("[app] notifyBlocksChange:", JSON.stringify(body));
        this.io ? this.io.emit(appevents.IOBlocksChange, body) : undefined;
    }

    private notifyRoundChange(body: any): void {
        console.log("[app] notifyRoundChange:", JSON.stringify(body));
        this.io ? this.io.emit(appevents.IORoundChange, body) : undefined;
    }

    // helpers
    private response(ctx: koa.Context, body?: any, error?: string): void {
        ctx.body = body
            ? { success: true, data: body }
            : { success: false, error };
    }
}

export default BlockchainMediator;