import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { IMessage } from 'src/interfaces/message.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<IMessage>
  ) { }

  
}