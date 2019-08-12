interface INotification {
    getName(): string;

    setBody(body: any): void;

    getBody(): undefined | any;

    setType(type: string): void;

    getType(): undefined | any;

    toString(): string;
}

export default INotification;