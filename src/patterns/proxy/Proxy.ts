import Notifier from "../observer/Notifier";
import IProxy from "../../interfaces/IProxy";
import INotifier from "../../interfaces/INotifier";
import IFacade from "../../interfaces/IFacade";

class Proxy extends Notifier implements IProxy, INotifier {
    constructor(private name: string, facade: IFacade) {
        super(facade);
    }

    get Name(): string {
        return this.name;
    }

    onRegister(): void {

    }

    onRemove(): void {

    }
}

export default Proxy;