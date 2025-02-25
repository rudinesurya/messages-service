import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessagesService } from './services/messages.service';
import { IMessageCreateResponse } from './interfaces/message-create-response.interface';
import { IMessageDeleteResponse } from './interfaces/message-delete-response.interface';
import { IMessageUpdateResponse } from './interfaces/message-update-response.interface';
import { IMessageUpdate } from './interfaces/message-update.interface';
import { IMessage } from './interfaces/message.interface';
import { IMessagesSearchResponse } from './interfaces/messages-search-response.interface';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
  ) { }

  @MessagePattern('messages_get')
  public async getMessages(): Promise<IMessagesSearchResponse> {
    let result: IMessagesSearchResponse;
    const messages = await this.messagesService.getMessages();
    result = {
      status: HttpStatus.OK,
      system_message: 'messages_get_success',
      messages: messages,
      errors: null,
    };

    return result;
  }

  @MessagePattern('message_create')
  public async createMessage(params: { createData: IMessage }): Promise<IMessageCreateResponse> {
    let result: IMessageCreateResponse;

    if (params && params.createData) {
      try {
        const message = await this.messagesService.createMessage(params.createData);
        result = {
          status: HttpStatus.CREATED,
          system_message: 'message_create_success',
          message: message,
          errors: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          system_message: 'message_create_precondition_failed',
          message: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        system_message: 'message_create_bad_request',
        message: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('message_update')
  public async updateMessage(params: { id: string; userId: string; updateData: IMessageUpdate }): Promise<IMessageUpdateResponse> {
    let result: IMessageUpdateResponse;

    if (params && params.id && params.userId && params.updateData) {
      try {
        const message = await this.messagesService.updateMessage(params.id, params.userId, params.updateData);
        result = {
          status: HttpStatus.OK,
          system_message: 'message_update_success',
          message: message,
          errors: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          system_message: 'message_update_precondition_failed',
          message: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        system_message: 'message_update_bad_request',
        message: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('message_delete_by_id')
  public async deleteMessage(params: {
    id: string;
    userId: string;
  }): Promise<IMessageDeleteResponse> {
    let result: IMessageDeleteResponse;

    if (params && params.id && params.userId) {
      try {
        await this.messagesService.removeMessage(params.id, params.userId);
        result = {
          status: HttpStatus.OK,
          system_message: 'message_delete_by_id_success',
          errors: null,
        };

      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          system_message: 'message_delete_by_id_precondition_failed',
          errors: e.errors,
        };
      }
    }
    else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        system_message: 'message_delete_by_id_bad_request',
        errors: null,
      };
    }
    return result;
  }
}