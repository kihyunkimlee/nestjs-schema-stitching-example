import { Module } from '@nestjs/common';
import { DogResolver } from './dog.resolver';
import { DogService } from './dog.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './dog.const';

@Module({
  providers: [
    DogResolver,
    DogService,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class DogModule {}
