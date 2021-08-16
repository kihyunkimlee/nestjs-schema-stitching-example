import { Inject } from '@nestjs/common';
import { Query, Mutation, Args, Subscription, Resolver } from '@nestjs/graphql';
import { CatEntity } from './entities/cat.entity';
import { PubSub } from 'graphql-subscriptions';
import { CatService } from './cat.service';
import { CreateCatInput } from './dto/create-cat.input';
import { PUB_SUB } from './cat.const';

@Resolver()
export class CatResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
    private readonly catService: CatService,
  ) {}

  /**
   * 모든 고양이 정보를 조회합니다.
   */
  @Query(() => [CatEntity], {
    name: 'cats',
    description: `
      (sub2's query)
      모든 고양이 정보를 조회합니다.
    `,
  })
  findAll(): CatEntity[] {
    return this.catService.findAll();
  }

  /**
   * 고양이 정보를 등록합니다.
   * @param input
   */
  @Mutation(() => CatEntity, {
    description: `
      (sub2's mutation)
      고양이 정보를 등록합니다.
    `,
  })
  createCat(@Args('input') input: CreateCatInput): CatEntity {
    return this.catService.createCat(input);
  }

  /**
   * 고양이 정보 등록 이벤트를 구독합니다.
   * 고양이 정복가 등록될 때마다 등록된 고양이 정보를 받게 됩니다.
   */
  @Subscription(() => CatEntity, {
    description: `
      (sub2's subscription)
      고양이 정보 등록 이벤트를 구독합니다.
      고양이 정복가 등록될 때마다 등록된 고양이 정보를 받게 됩니다.
    `,
  })
  createdCat() {
    return this.pubsub.asyncIterator('createdCat');
  }

  /**
   * 고양이 울음 이벤트를 구독합니다.
   * 5초 마다 고양이가 웁니다.
   */
  @Subscription(() => String, {
    description: `
      (sub2's subscription)
      고양이 울음 이벤트를 구독합니다.
      5초 마다 고양이가 웁니다.
    `,
  })
  catCried() {
    return this.pubsub.asyncIterator('catCried');
  }
}
