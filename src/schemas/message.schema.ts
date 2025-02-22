import * as mongoose from 'mongoose';

export interface IMessageSchema extends mongoose.Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    content: string;
}

export const MessageSchema = new mongoose.Schema<IMessageSchema>(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Adjust the ref as needed
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Adjust the ref as needed
            required: true,
        },
        content: {
            type: String,
        },
    },
    {
        toObject: {
            virtuals: false,
            versionKey: false,
        },
        toJSON: {
            virtuals: false,
            versionKey: false,
        },
    },
);