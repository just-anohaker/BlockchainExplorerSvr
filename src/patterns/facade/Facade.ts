import IFacade from "../../interfaces/IFacade";
import IModel from "../../interfaces/IModel";
import IController from "../../interfaces/IController";
import Model from "../../core/Model";
import Controller from "../../core/Controller";

import IMediator from "../../interfaces/IMediator";
import IProxy from "../../interfaces/IProxy";
import IObserver from "../../interfaces/IObserver";
import INotification from "../../interfaces/INotification"
import Notification from "../observer/Notification";


class Facade implements IFacade {
    protected models?: IModel;
    protected controllers: IController;
    protected observers: Map<string, IObserver[]>;

    constructor() {
        this.observers = new Map<string, IObserver[]>();
        this.initializeFacade();
    }

    private initializeFacade(): void {
        this.initializeModel();
        this.initializeMediator();
    }

    private initializeModel(): void {
        if (this.models === undefined) {
            this.models = new Model();
        }
    }

    private initializeMediator(): void {
        if (this.controllers === undefined) {
            this.controllers = new Controller();
        }
    }

    /// proxy 
    registerProxy(proxy: IProxy): void {
        this.models!.registerProxy(proxy);
    }

    removeProxy(proxyName: string): undefined | IProxy {
        return this.models!.removeProxy(proxyName);
    }

    retrieveProxy<T extends IProxy>(proxyName: string): undefined | T {
        return this.models!.retrieveProxy<T>(proxyName);
    }

    hasProxy(proxyName: string): boolean {
        return this.models!.hasProxy(proxyName);
    }

    /// mediator
    registerMediator(mediator: IMediator): void {
        this.controllers!.registerMediator(mediator);
    }

    removeMediator(mediatorName: string): undefined | IMediator {
        return this.controllers!.removeMediator(mediatorName);
    }

    retrieveMediator<T extends IMediator>(mediatorName: string): undefined | T {
        return this.controllers!.retrieveMediator<T>(mediatorName);
    }

    hasMediator(mediatorName: string): boolean {
        return this.controllers!.hasMediator(mediatorName);
    }

    /// observer
    registerObserver(notificationName: string, observer: IObserver): void {
        const collections = this.observers.get(notificationName);
        if (collections == null) {
            this.observers.set(notificationName, [observer]);
        } else {
            collections.push(observer);
        }
    }

    removeObserver(notificationName: string, notifyContext: any): void {
        const collections = this.observers.get(notificationName);
        if (collections == null) return;

        let idx = collections.length;
        while (idx--) {
            const inst = collections[idx];
            if (inst.compareContext(notifyContext)) {
                collections.splice(idx, 1);
                break;
            }
        }

        if (collections.length == 0) {
            this.observers.delete(notificationName);
        }
    }

    notifyObserver(notification: INotification): void {
        const name = notification.getName();
        const collections = this.observers.get(name);
        if (collections) {
            const observers = collections.slice();
            observers.forEach(val => {
                val.notify(notification);
            });
        }
    }

    sendNotification(name: string, body?: any, type?: string): void {
        this.notifyObserver(new Notification(name, body, type));
    }
}

export default Facade;