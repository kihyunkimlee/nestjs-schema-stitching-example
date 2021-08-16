import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { FoxService } from './fox.service';
import { PUB_SUB } from './fox.const';
import { FoxEntity } from './entities/fox.entity';
import { CreateFoxInput } from './dto/create-fox.input';

@Resolver()
export class FoxResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
    private readonly foxService: FoxService,
  ) {}

  /**
   * 모든 여우 정보를 조회합니다.
   */
  @Query(() => [FoxEntity], {
    name: 'foxes',
    description: `
      (gateway's query)
      모든 여우 정보를 조회합니다.
    `,
  })
  findAll(): FoxEntity[] {
    return this.foxService.findAll();
  }

  /**
   * 여우 정보를 등록합니다.
   * @param input
   */
  @Mutation(() => FoxEntity, {
    description: `
      (gateway's mutation)
      여우 정보를 등록합니다.
    `,
  })
  createFox(@Args('input') input: CreateFoxInput): FoxEntity {
    return this.foxService.createFox(input);
  }

  /**
   * 여우 등록 이벤트를 구독합니다.
   * 여우가 등록될 때마다 등록된 여우 정보를 받게 됩니다.
   */
  @Subscription(() => FoxEntity, {
    description: `
      (gateway's subscription)
      여우 정보 등록 이벤트를 구독합니다.
      여우 정보가 등록될 때마다 등록된 여우 정보를 받게 됩니다.
    `,
  })
  createdFox() {
    return this.pubsub.asyncIterator('createdFox');
  }

  /**
   * 여우 말하기 이벤트를 구독합니다.
   * 5초 마다 여우가 말합니다.
   */
  @Subscription(() => String, {
    description: `
      (gateway's subscription)
      여우 울음 이벤트를 구독합니다.
      5초 마다 여우가 웁니다.
    `,
  })
  foxCried() {
    return this.pubsub.asyncIterator('foxCried');
  }
}
