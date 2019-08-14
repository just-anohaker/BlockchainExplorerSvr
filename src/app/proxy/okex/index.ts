import { PublicClient, V3WebsocketClient } from "@okfe/okex-node";
import { Proxy, IFacade, IObserver, Observer, INotification } from "pure-framework";
import AppFacade from "../../App";
import appevents from "../../base/common/events";
import { constants } from "../../base/config";

const TIMEOUT_DURATION = 30 * 1000;
const CHANNEL_PREFIX = "spot/ticker";

class OkexProxy extends Proxy {
    static TagName: string = "OkexProxy";

    private publicClient = PublicClient();
    private websocketClient?: V3WebsocketClient;

    private observer: IObserver;
    private timeout?: NodeJS.Timeout;

    constructor(facade: IFacade) {
        super(OkexProxy.TagName, facade);

        this.observer = new Observer(this.onNotification, this);
    }

    onRegister(): void {
        super.onRegister();

        AppFacade.getInstance().registerObserver(appevents.EvtAppReady, this.observer);
    }

    onNotification(notification: INotification): void {
        const name = notification.getName();
        if (name === appevents.EvtAppReady) {
            // console.log("app ready");

            this.startWebsocketClient();
        }
    }

    // public
    async getSpotTicker(instrument_id: string): Promise<any> {
        return await this.publicClient.spot().getSpotTicker(instrument_id);
    }

    // private
    private startWebsocketClient() {
        // console.log("[app] startWebsocketClient");
        this.stopWebsocketClient();

        this.websocketClient = new V3WebsocketClient();
        this.websocketClient.on("open", () => this.onWebsocketOpened());
        this.websocketClient.on("close", () => this.onWebsocketClosed());
        this.websocketClient.on("message", data => this.onWebsocketMessage(data));

        this.websocketClient.connect();

        this.startTimeout();
    }

    private startTimeout() {
        this.stopTimeout();

        this.timeout = setTimeout(() => {
            console.log("[app] startTimeout handled");
            this.timeout = undefined;

            this.startWebsocketClient();
        }, TIMEOUT_DURATION);
    }

    private stopTimeout() {
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }

    private stopWebsocketClient() {
        // console.log("[app] stopWebsocketClient");
        if (this.websocketClient) {
            this.websocketClient.removeAllListeners("open");
            this.websocketClient.removeAllListeners("closed");
            this.websocketClient.removeAllListeners("message");
            this.websocketClient.close();
            this.websocketClient = undefined;
        }
    }

    private initMonitChannel() {
        this.websocketClient!.subscribe(`${CHANNEL_PREFIX}:${constants.cOkexETMInstrumentId}`);
    }

    private onWebsocketOpened() {
        // console.log("[app] onWebsocketOpened");
        this.stopTimeout();

        this.initMonitChannel();
    }

    private onWebsocketClosed(restart: boolean = true) {
        // console.log("[app] onWebsocketClosed");
        restart ? this.stopWebsocketClient() : undefined;

        this.stopTimeout();
        this.startWebsocketClient();
    }

    private onWebsocketMessage(data: string) {
        // console.log("[app] onWebsocketMessage");
        try {
            const dataObj = JSON.parse(data);
            if (dataObj.event && typeof dataObj.event === "string") {
                if (dataObj.event === "error") {
                    console.log("[app] onWebsocketMessage event[error]:", dataObj);
                    // TODO
                }
            } else if (dataObj.table && typeof dataObj.table === "string") {
                switch (dataObj.table) {
                    case CHANNEL_PREFIX: {
                        this.onSpotTickerMessage(dataObj);
                    }
                }
            } else {
                console.log("[app] onWebsocketMessage unhandle:", dataObj);
            }
        } catch (error) {
            console.log("[app] onWebsocketMessage error:", error);
        }
    }

    private onSpotTickerMessage(dataObj: any) {
        // console.log("[app] onSpotTickerMessage:", dataObj);
        const data = dataObj.data;
        data.forEach((item: any) => {
            if (item.instrument_id === constants.cOkexETMInstrumentId) {
                this.sendNotification(appevents.EvtOkexTicker, item);
            }
        });
    }
}

export default OkexProxy;