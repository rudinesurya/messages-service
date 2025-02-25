import { IMessage } from "./message.interface";

export interface IMessageUpdateResponse {
    status: number;
    system_message: string;
    message: IMessage | null;
    errors: { [key: string]: any } | null;
}