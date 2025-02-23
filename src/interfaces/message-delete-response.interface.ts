export interface IMessageDeleteResponse {
    status: number;
    message: string;
    errors: { [key: string]: any };
}   