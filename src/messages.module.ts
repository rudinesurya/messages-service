import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './services/config/config.service';
import { MessagesController } from './messages.controller';
import { MessageSchema } from './schemas/message.schema';
import { MongoConfigService } from './services/config/mongo-config.service';
import { MessagesService } from './services/messages.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
        collection: 'messages',
      },
    ]),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    ConfigService,
  ],
})
export class MessagesModule { }