import INotification from "./INotification";

interface IObserver {
    setMethod(mothod: Function): void;

    setContext(context: any): void;

    notify(notification: INotification): void;

    compareContext(context: any): boolean;
}

export default IObserver;