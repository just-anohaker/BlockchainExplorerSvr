import IController from "../interfaces/IController";
import IMediator from "../interfaces/IMediator";

class Controller implements IController {
    private _mediators: Map<string, IMediator>;

    constructor() {
        this._mediators = new Map<string, IMediator>();

        this.initializeController();
    }

    initializeController(): void {

    }

    registerMediator(mediator: IMediator): void {
        if (this.hasMediator(mediator.Name)) {
            return;
        }

        this._mediators.set(mediator.Name, mediator);
        mediator.onRegister();
    }

    removeMediator(mediatorName: string): undefined | IMediator {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }

        const mediator = this._mediators.get(mediatorName);
        this._mediators.delete(mediatorName);
        mediator.onRemove();
        return mediator;
    }

    retrieveMediator<T extends IMediator>(mediatorName: string): undefined | T {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }

        const mediator = this._mediators.get(mediatorName);
        return mediator as T;
    }

    hasMediator(mediatorName: string): boolean {
        return this._mediators.has(mediatorName);
    }
}

export default Controller;