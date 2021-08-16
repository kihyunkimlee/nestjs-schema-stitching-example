import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DogEntity } from './entities/dog.entity';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CreateDogInput } from './dto/create-dog.input';
import { DogService } from './dog.service';
import { PUB_SUB } from './dog.const';

@Resolver()
export class DogResolver {
  constructor(
    private readonly dogService: DogService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  /**
   * 모든 강아지 정보를 조회합니다.
   */
  @Query(() => [DogEntity], {
    name: 'dogs',
    description: `
      (sub1's query)
      모든 강아지 정보를 조회합니다.
    `,
  })
  findAll(): DogEntity[] {
    return this.dogService.findAll();
  }

  /**
   * 강아지 정보를 등록합니다.
   * @param input
   */
  @Mutation(() => DogEntity, {
    description: `
      (sub1's mutation)
      강아지 정보를 등록합니다.
    `,
  })
  createDog(@Args('input') input: CreateDogInput): DogEntity {
    return this.dogService.createDog(input);
  }
}
