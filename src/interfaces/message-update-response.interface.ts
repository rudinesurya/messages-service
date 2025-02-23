import { IMessage } from "./message.interface";

export interface IMessageUpdateResponse {
    status: number;
    message: string;
    message: IMessage | null;
    errors: { [key: string]: any };
}