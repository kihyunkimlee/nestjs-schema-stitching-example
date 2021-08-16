import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DogEntity } from './entities/dog.entity';
import { CreateDogInput } from './dto/create-dog.input';
import { PUB_SUB } from './dog.const';

@Injectable()
export class DogService {
  // 프로젝트를 간단하게 만들기 위해서 배열에 강아지 정보를 저장합니다.
  private dogs: DogEntity[] = [
    {
      id: 1,
      name: '백구',
      age: 3,
    },
    {
      id: 2,
      name: '누렁이',
      age: 4,
    },
  ];

  constructor(@Inject(PUB_SUB) private readonly pubsub: PubSub) {}

  findAll(): DogEntity[] {
    return this.dogs;
  }

  createDog(input: CreateDogInput) {
    const dog: DogEntity = {
      id: this.dogs.length + 1,
      ...input,
    };

    // 새로운 강아지 정보를 배열에 추가합니다.
    this.dogs.push(dog);

    return dog;
  }
}
