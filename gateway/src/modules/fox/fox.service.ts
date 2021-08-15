import { Inject, Injectable } from '@nestjs/common';
import { PUB_SUB } from './fox.const';
import { PubSub } from 'graphql-subscriptions';
import { FoxEntity } from './entities/fox.entity';
import { CreateFoxInput } from './dto/create-fox.input';

@Injectable()
export class FoxService {
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
    // 5초마다 여우 말하기(said) 이벤트가 발행되도록 tic 메서드를 호출합니다.
    this.tic();
  }

  tic(): void {
    setTimeout(() => {
      this.pubsub.publish('said', { said: '히야히야히~' });

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

    this.foxes.push(fox);

    return fox;
  }
}
