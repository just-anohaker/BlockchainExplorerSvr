import { Proxy, IFacade, IObserver, Observer, INotification } from "pure-framework";
import appevents from "../../base/common/events";

class TemplateProxy extends Proxy {
    static TagName: string = "TemplateProxy";

    private observer: IObserver;

    constructor(facade: IFacade) {
        super(TemplateProxy.TagName, facade);

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

        super.onRemove();
    }

    // public
    async publicMethod(): Promise<void> {
        // TODO
    }

    // private
    private onNotification(notification: INotification): void {
        const name = notification.getName();
        if (name === appevents.EvtAppReady) {
            // console.log("app ready");
        }
    }
}

export default TemplateProxy;