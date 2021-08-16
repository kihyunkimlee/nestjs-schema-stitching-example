import { Inject, Injectable } from '@nestjs/common';
import { PUB_SUB } from './fox.const';
import { PubSub } from 'graphql-subscriptions';
import { FoxEntity } from './entities/fox.entity';
import { CreateFoxInput } from './dto/create-fox.input';

@Injectable()
export class FoxService {
  // 프로젝트를 간단하게 만들기 위해서 배열에 여우 정보를 저장합니다.
  private foxes: FoxEntity[] = [
    {
      id: 1,
      name: '붉은 여우',
      age: 10,
    },
    {
      id: 2,
      name: '푸른 여우',
      age: 12,
    },
  ];

  constructor(@Inject(PUB_SUB) private readonly pubsub: PubSub) {
    // tic 메서드를 호출하면 5초마다 여우 말하기(foxCried) 이벤트가 발행됩니다.
    this.tic();
  }

  tic(): void {
    setTimeout(() => {
      this.pubsub.publish('foxCried', { foxCried: '히야히야히~' });

      this.tic();
    }, 5000);
  }

  findAll(): FoxEntity[] {
    return this.foxes;
  }

  createFox(input: CreateFoxInput) {
    const fox: FoxEntity = {
      id: this.foxes.length + 1,
      ...input,
    };

    // 새로운 여우 정보를 배열에 추가합니다.
    this.foxes.push(fox);

    // 여우 정보 등록(createdFox) 이벤트를 발행합니다.
    this.pubsub.publish('createdFox', { createdFox: fox });

    return fox;
  }
}
