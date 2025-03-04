import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessagesService } from './services/messages.service';
import { IMessageCreateResponse } from './interfaces/message-create-response.interface';
import { IMessageDeleteResponse } from './interfaces/message-delete-response.interface';
import { IMessageUpdateResponse } from './interfaces/message-update-response.interface';
import { IMessageUpdate } from './interfaces/message-update.interface';
import { IMessage } from './interfaces/message.interface';
import { IMessagesSearchResponse } from './interfaces/messages-search-response.interface';
import logger from './services/logger';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @MessagePattern('messages_get_by_chat_id')
  public async getMessagesByChatId({ id }: { id: string }): Promise<IMessagesSearchResponse> {
    logger.info(`Fetching messages for chat ID: ${id}`);

    if (!id) {
      logger.warn(`Missing chat ID in request`);
      return {
        status: HttpStatus.BAD_REQUEST,
        system_message: 'messages_get_bad_request',
        messages: null,
        errors: null,
      };
    }

    try {
      const messages = await this.messagesService.getMessagesByChatId(id);
      logger.info(`Messages fetched successfully for chat ID: ${id}`);

      return {
        status: HttpStatus.OK,
        system_message: 'messages_get_success',
        messages,
        errors: null,
      };
    } catch (error) {
      logger.error(`Error fetching messages`, { error: error.message, stack: error.stack });

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        system_message: 'messages_get_internal_error',
        messages: null,
        errors: error.errors || error.message,
      };
    }
  }

  @MessagePattern('message_create')
  public async createMessage(params: { createData: IMessage }): Promise<IMessageCreateResponse> {
    logger.info(`Received request to create a message`);

    if (!params?.createData) {
      logger.warn(`Missing createData in message creation request`);
      return {
        status: HttpStatus.BAD_REQUEST,
        system_message: 'message_create_bad_request',
        message: null,
        errors: null,
      };
    }

    try {
      const message = await this.messagesService.createMessage(params.createData);
      logger.info(`Message created successfully`);

      return {
        status: HttpStatus.CREATED,
        system_message: 'message_create_success',
        message,
        errors: null,
      };
    } catch (error) {
      logger.error(`Error creating message`, { error: error.message, stack: error.stack });

      return {
        status: HttpStatus.PRECONDITION_FAILED,
        system_message: 'message_create_precondition_failed',
        message: null,
        errors: error.errors || error.message,
      };
    }
  }

  @MessagePattern('message_update')
  public async updateMessage(params: { id: string; userId: string; updateData: IMessageUpdate }): Promise<IMessageUpdateResponse> {
    logger.info(`Received request to update message with ID: ${params?.id}, userId: ${params?.userId}`);

    if (!params?.id || !params?.userId || !params?.updateData) {
      logger.warn(`Invalid request parameters for message update`);
      return {
        status: HttpStatus.BAD_REQUEST,
        system_message: 'message_update_bad_request',
        message: null,
        errors: null,
      };
    }

    try {
      const message = await this.messagesService.updateMessage(params.id, params.userId, params.updateData);
      logger.info(`Message updated successfully with ID: ${params.id}`);

      return {
        status: HttpStatus.OK,
        system_message: 'message_update_success',
        message,
        errors: null,
      };
    } catch (error) {
      logger.error(`Error updating message`, { error: error.message, stack: error.stack });

      return {
        status: HttpStatus.PRECONDITION_FAILED,
        system_message: 'message_update_precondition_failed',
        message: null,
        errors: error.errors || error.message,
      };
    }
  }

  @MessagePattern('message_delete_by_id')
  public async deleteMessage(params: { id: string; userId: string }): Promise<IMessageDeleteResponse> {
    logger.info(`Received request to delete message with ID: ${params?.id}, userId: ${params?.userId}`);

    if (!params?.id || !params?.userId) {
      logger.warn(`Invalid request parameters for message deletion`);
      return {
        status: HttpStatus.BAD_REQUEST,
        system_message: 'message_delete_by_id_bad_request',
        errors: null,
      };
    }

    try {
      await this.messagesService.removeMessage(params.id, params.userId);
      logger.info(`Message deleted successfully with ID: ${params.id}`);

      return {
        status: HttpStatus.OK,
        system_message: 'message_delete_by_id_success',
        errors: null,
      };
    } catch (error) {
      logger.error(`Error deleting message`, { error: error.message, stack: error.stack });

      return {
        status: HttpStatus.PRECONDITION_FAILED,
        system_message: 'message_delete_by_id_precondition_failed',
        errors: error.errors || error.message,
      };
    }
  }
}