import { IMessage } from "./message.interface";

export interface IMessagesSearchResponse {
    status: number;
    system_message: string;
    messages: IMessage[] | null;
    errors: { [key: string]: any } | null;
}