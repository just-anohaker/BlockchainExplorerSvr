import INotifier from "./INotifier";

interface IMediator extends INotifier {
    readonly Name: string;

    onRegister(): void;

    onRemove(): void;
}

export default IMediator;