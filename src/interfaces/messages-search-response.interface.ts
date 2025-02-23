import { IMessage } from "./message.interface";

export interface IMessagesSearchResponse {
    status: number;
    message: string;
    messages: IMessage[] | null;
}