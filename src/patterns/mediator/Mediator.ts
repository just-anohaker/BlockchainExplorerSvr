import Notifier from "../observer/Notifier";
import IMediator from "../../interfaces/IMediator";
import INotifier from "../../interfaces/INotifier";
import IFacade from "../../interfaces/IFacade";

class Mediator extends Notifier implements IMediator, INotifier {
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

export default Mediator;