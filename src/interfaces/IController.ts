import IMediator from "./IMediator";

interface IController {
    registerMediator(mediator: IMediator): void;

    removeMediator(mediatorName: string): undefined | IMediator;

    retrieveMediator<T extends IMediator>(mediatorName: string): undefined | T;

    hasMediator(mediatorName: string): boolean;
}

export default IController;