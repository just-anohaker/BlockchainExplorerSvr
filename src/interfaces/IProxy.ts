import INotifier from "./INotifier";

interface IProxy extends INotifier {
    readonly Name: string;

    onRegister(): void;

    onRemove(): void;
}

export default IProxy;