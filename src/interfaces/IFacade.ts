import IProxy from "./IProxy";
import IMediator from "./IMediator";
import INotifier from "./INotifier";
import IObserver from "./IObserver";
import INotification from "./INotification";

interface IFacade extends INotifier {
    registerProxy(proxy: IProxy): void;

    removeProxy(proxyName: string): undefined | IProxy;

    retrieveProxy<T extends IProxy>(proxyName: string): undefined | T;

    hasProxy(proxyName: string): boolean;

    registerMediator(mediator: IMediator): void;

    removeMediator(mediatorName: string): undefined | IMediator;

    retrieveMediator<T extends IMediator>(mediatorName: string): undefined | T;

    hasMediator(mediatorName: string): boolean;

    registerObserver(notificationName: string, observer: IObserver): void;

    removeObserver(notificationName: string, notifyContext: any): void;

    notifyObserver(notification: INotification): void;
}

export default IFacade;