import INotification from "./INotification";

interface IObserver {
    setNotifyMethod(mothod: Function): void;

    setNotifyContext(context: any): void;

    notifyObserver(notification: INotification): void;

    compareNotifyContext(context: any): boolean;
}

export default IObserver;