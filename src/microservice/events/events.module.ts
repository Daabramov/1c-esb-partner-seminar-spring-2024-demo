import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { WssGateway } from 'src/microservice/events/events.gateway';

@Module({
  controllers: [EventsController],
  providers: [WssGateway],
  exports: [WssGateway],
})
export class EventsModule {}
