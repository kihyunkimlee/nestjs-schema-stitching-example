import { Module } from '@nestjs/common';
import { FoxResolver } from './fox.resolver';
import { FoxService } from './fox.service';
import { PUB_SUB } from './fox.const';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    FoxResolver,
    FoxService,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class FoxModule {}
