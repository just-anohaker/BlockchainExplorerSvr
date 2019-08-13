import Proxy from "../../../patterns/proxy/Proxy";
import IFacade from "../../../interfaces/IFacade";

import { PublicClient, V3WebsocketClient } from "@okfe/okex-node";
import IObserver from "../../../interfaces/IObserver";
import Observer from "../../../patterns/observer/Observer";
import INotification from "../../../interfaces/INotification";
import AppFacade from "../../App";

const TIMEOUT_DURATION = 30 * 1000;

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

        AppFacade.getInstance().registerObserver("evt_app_ready", this.observer);
    }

    onNotification(notification: INotification): void {
        const name = notification.getName();
        if (name === "evt_app_ready") {
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

            if (this.websocketClient) {
                const client = this.websocketClient;
                this.websocketClient = undefined;

                client.removeAllListeners("open");
                client.removeAllListeners("close");
                client.removeAllListeners("message");
                client.close();
            }

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
        this.websocketClient.subscribe("spot/ticker:ETM-USDT")
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
                    case "spot/ticker": {
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
        data.forEach(item => {
            if (item.instrument_id === "ETM-USDT") {
                this.sendNotification("evt_okex_ticker", item);
            }
        });
    }
}

export default OkexProxy;