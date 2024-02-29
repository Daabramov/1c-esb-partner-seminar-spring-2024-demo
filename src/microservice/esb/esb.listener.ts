import { Injectable, Logger } from '@nestjs/common';
import { Listen } from '@team-supercharge/nest-amqp';
import { EventDto } from 'src/microservice//events/events.dto';
import { WssGateway } from 'src/microservice//events/events.gateway';
import { config } from 'dotenv';

config();

@Injectable()
export class EsbEventListener {
  constructor(private wss: WssGateway) {}
  private readonly logger = new Logger(EsbEventListener.name);

  @Listen(process.env.ESB_CHANNEL_EVENTS, { type: EventDto })
  public async listenForNewEvent(eventData: EventDto): Promise<void> {
    this.logger.debug(
      `Process new message from queue ${process.env.ESB_CHANNEL_EVENTS}`,
    );
    this.logger.debug(`message body: ${JSON.stringify(eventData)}`);
    this.wss.PostRequestEvent(eventData);
  }
}
