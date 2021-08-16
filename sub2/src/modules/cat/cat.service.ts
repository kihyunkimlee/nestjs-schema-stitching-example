import { Injectable, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CatEntity } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { PUB_SUB } from './cat.const';

@Injectable()
export class CatService {
  // 프로젝트를 간단하게 만들기 위해서 배열에 고양이 정보를 저장합니다.
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
    // tic 메서드를 호출하면 5초마다 고양이 울음(catCried) 이벤트가 발행됩니다.
    this.tic();
  }

  tic(): void {
    setTimeout(() => {
      this.pubsub.publish('catCried', { catCried: '야옹~' });

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

    // 새로운 고양 정보를 배열에 추가합니다.
    this.cats.push(cat);

    // 고양이 정보 등록(createdCat) 이벤트를 발행합니다.
    this.pubsub.publish('createdCat', { createdCat: cat });

    return cat;
  }
}
