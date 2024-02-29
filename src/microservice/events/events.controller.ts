import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { EventDto } from './events.dto';
import { WssGateway } from 'src/microservice/events/events.gateway';
import { AuthGuard } from 'src/microservice/auth/auth.guard';

@Controller('api/events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private wss: WssGateway) {}

  @Post()
  createEvent(@Body() eventData: EventDto) {
    this.wss.PostRequestEvent(eventData);
  }

  @Get()
  getEvent(): string {
    return 'test';
  }
}
