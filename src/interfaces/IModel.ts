import IProxy from "./IProxy";

interface IModel {
    registerProxy(proxy: IProxy): void;

    removeProxy(proxyName: string): undefined | IProxy;

    retrieveProxy<T extends IProxy>(proxyName: string): undefined | T;

    hasProxy(proxyName: string): boolean;
}

export default IModel;