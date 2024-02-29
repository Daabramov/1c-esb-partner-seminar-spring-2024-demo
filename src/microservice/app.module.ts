import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { EsbModule } from './esb/esb.module';
import { QueueModule, QueueModuleOptions } from '@team-supercharge/nest-amqp';
import configuration from './config/configuration';

@Module({ imports: [AppModule.forRoot()] })
export class AppModule {
  static forRoot(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        EventsModule,
        AuthModule,
        EsbModule,
        QueueModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (): Promise<QueueModuleOptions> => {
            const token = await fetchToken();
            return {
              connectionUri: `amqp://${token}:${token}@${process.env.ESB_HOST}:6698/${process.env.ESB_VHOST}`,
              throwExceptionOnConnectionError: true,
              isGlobal: true,
            };
          },
        }),
      ],
    };
  }
}

import fetch from 'node-fetch';
async function fetchToken() {
  const response = await fetch(`${(process.env.ESB_SSL || 'false') == 'true' ? 'https' : 'http' }://${process.env.ESB_HOST}:${process.env.ESB_HTTP_PORT}/auth/oidc/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // eslint-disable-next-line prettier/prettier
    'Authorization':
        'Basic ' + btoa(process.env.ESB_LOGIN + ':' + process.env.ESB_PASSWORD),
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });
  const repsonseData = await response.json();
  return (repsonseData as any).id_token;
}
