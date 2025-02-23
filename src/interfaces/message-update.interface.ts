import { Document } from 'mongoose';

export interface IMessageUpdate extends Document {
    content: string;
}