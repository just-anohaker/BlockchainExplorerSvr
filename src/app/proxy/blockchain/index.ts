import { Proxy, IFacade, IObserver, Observer, INotification } from "pure-framework";
import SocketIOClient from "socket.io-client";
import appevents from "../../base/common/events";
import config from "../../base/config";
import { NBBlockChange } from "../../base/common/definitions";

class BlockchainProxy extends Proxy {
    static TagName: string = "BlockchainProxy";

    private observer: IObserver;
    private socket?: SocketIOClient.Socket;

    constructor(facade: IFacade) {
        super(BlockchainProxy.TagName, facade);

        this.observer = new Observer(this.onNotification, this);
    }

    // overwrite
    onRegister(): void {
        super.onRegister();

        this.facade.registerObserver(appevents.EvtAppReady, this.observer);
    }

    // overwrite
    onRemove(): void {
        this.facade.removeObserver(appevents.EvtAppReady, this);
        this.stopConnection();

        super.onRemove();
    }

    // // public
    // async publicMethod(): Promise<void> {
    //     // TODO
    // }

    // private
    private onNotification(notification: INotification): void {
        const name = notification.getName();
        if (name === appevents.EvtAppReady) {
            // console.log("app ready");
            this.startConnection();
        }
    }

    private onBlockChangedEvent(data: NBBlockChange): void {
        this.sendNotification(appevents.EvtBlocksChange, data);
    }

    private onRoundChangedEvent(data: any): void {
        this.sendNotification(appevents.EvtRoundChange, data);
    }

    private startConnection(): void {
        this.stopConnection();

        this.socket = SocketIOClient(config.ETMServer);

        this.socket.on("blocks/change", this.onBlockChangedEvent.bind(this));
        this.socket.on("rounds/change", this.onRoundChangedEvent.bind(this));
    }

    private stopConnection(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    }
}

export default BlockchainProxy;