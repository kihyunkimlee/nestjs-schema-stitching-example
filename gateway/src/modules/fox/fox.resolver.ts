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
   * 모든 여우를 조회합니다.
   */
  @Query(() => [FoxEntity], {
    name: 'foxes',
  })
  findAll(): FoxEntity[] {
    return this.foxService.findAll();
  }

  /**
   * 여우를 등록합니다.
   * @param input
   */
  @Mutation(() => FoxEntity)
  createFox(@Args('input') input: CreateFoxInput): FoxEntity {
    return this.foxService.createFox(input);
  }

  /**
   * 여우 말하기 이벤트를 구독합니다.
   * 5초 마다 여우가 말합니다.
   */
  @Subscription(() => String)
  said() {
    return this.pubsub.asyncIterator('said');
  }
}
