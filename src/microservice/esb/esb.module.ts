import { Module } from '@nestjs/common';
import { QueueModule } from '@team-supercharge/nest-amqp';
import { EsbEventListener } from './esb.listener';
import { EventsModule } from 'src/microservice/events/events.module';

@Module({
  imports: [QueueModule.forFeature(), EventsModule],
  providers: [EsbEventListener],
})
export class EsbModule {}
