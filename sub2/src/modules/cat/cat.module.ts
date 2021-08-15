import { Module } from '@nestjs/common';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './cat.const';

@Module({
  providers: [
    CatResolver,
    CatService,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class CatModule {}
