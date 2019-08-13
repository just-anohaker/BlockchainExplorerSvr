import INotifier from "../../interfaces/INotifier";
import IFacade from "../../interfaces/IFacade";

class Notifier implements INotifier {
    constructor(protected facade: IFacade) { }

    sendNotification(name: string, body?: any, type: string = ""): void {
        this.facade.sendNotification(name, body, type);
    }
}

export default Notifier;