import IModel from "../interfaces/IModel";
import IProxy from "../interfaces/IProxy";

class Model implements IModel {
    private _proxies: Map<string, IProxy>;

    constructor() {
        this._proxies = new Map<string, IProxy>();

        this.initializeModel();
    }

    initializeModel(): void {

    }

    registerProxy(proxy: IProxy): void {
        if (this.hasProxy(proxy.Name)) {
            return;
        }

        this._proxies.set(proxy.Name, proxy);
        proxy.onRegister();
    }

    removeProxy(proxyName: string): undefined | IProxy {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }

        const proxy = this._proxies.get(proxyName);
        this._proxies.delete(proxyName);
        proxy!.onRemove();
        return proxy;
    }

    retrieveProxy<T extends IProxy>(proxyName: string): undefined | T {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }

        const proxy = this._proxies.get(proxyName);
        return proxy as T;
    }

    hasProxy(proxyName: string): boolean {
        return this._proxies.has(proxyName);
    }
}

export default Model;