import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMessage, IMessageUpdate } from '@rudinesurya/messages-service-interfaces';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<IMessage>
  ) { }

  public async getMessagesByChatId(id: string): Promise<IMessage[]> {
    return this.messageModel
      .find({ chat_id: id })
      .exec();
  }

  public async createMessage(message: IMessage): Promise<IMessage> {
    try {
      const messageModel = new this.messageModel(message);
      return await messageModel.save();
    } catch (error: any) {
      // MongoDB duplicate key error code
      if (error.code === 11000) {
        throw new ForbiddenException('You have already created this message.');
      }
      throw error;
    }
  }

  public async updateMessage(id: string, userId: string, updateData: IMessageUpdate): Promise<IMessage> {
    const updatedMessage = await this.messageModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), sender: new Types.ObjectId(userId) },
      { $set: updateData },
      { new: true }
    ).exec();

    if (!updatedMessage) {
      throw new NotFoundException('Message not found or you are not the owner');
    }

    return updatedMessage;
  }

  public async removeMessage(id: string, userId: string): Promise<{ system_message: string }> {
    const deletedMessage = await this.messageModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      sender: new Types.ObjectId(userId),
    }).exec();

    if (!deletedMessage) {
      throw new NotFoundException('Message not found or you are not the owner');
    }

    return { system_message: 'Message removed successfully' };
  }
}