import IObserver from "../../interfaces/IObserver";
import INotification from "../../interfaces/INotification";

class Observer implements IObserver {
    constructor(protected method: Function, protected context: any) { }

    private get Method(): Function {
        return this.method;
    }

    private get Context(): any {
        return this.context;
    }

    setMethod(method: Function): void {
        this.method = method;
    }

    setContext(context: any): void {
        this.context = context;
    }

    notify(notification: INotification): void {
        this.Method.call(this.Context, notification);
    }

    compareContext(context: any): boolean {
        return context === this.context;
    }
}

export default Observer;