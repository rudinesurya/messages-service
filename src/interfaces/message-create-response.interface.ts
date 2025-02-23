import { IMessage } from "./message.interface";

export interface IMessageCreateResponse {
    status: number;
    message: string;
    message: IMessage | null;
    errors: { [key: string]: any };
}