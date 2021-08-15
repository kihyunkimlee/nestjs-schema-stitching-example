import { Injectable, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CatEntity } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { PUB_SUB } from './cat.const';

@Injectable()
export class CatService {
  private cats: CatEntity[] = [
    {
      id: 1,
      name: '나옹이',
      age: 5,
    },
    {
      id: 2,
      name: '애용이',
      age: 6,
    },
  ];

  constructor(@Inject(PUB_SUB) private readonly pubsub: PubSub) {
    // 5초마다 고양이 울음(cried) 이벤트가 발행되도록 tic 메서드를 호출합니다.
    this.tic();
  }

  tic(): void {
    setTimeout(() => {
      this.pubsub.publish('cried', { cried: '야옹~' });

      this.tic();
    }, 5000);
  }

  findAll(): CatEntity[] {
    return this.cats;
  }

  createCat(input: CreateCatInput) {
    const cat: CatEntity = {
      id: this.cats.length + 1,
      ...input,
    };

    this.cats.push(cat);

    this.pubsub.publish('createdCat', { createdCat: cat });

    return cat;
  }
}
