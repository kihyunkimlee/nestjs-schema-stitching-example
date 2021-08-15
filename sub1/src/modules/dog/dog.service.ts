import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DogEntity } from './entities/dog.entity';
import { CreateDogInput } from './dto/create-dog.input';
import { PUB_SUB } from './dog.const';

@Injectable()
export class DogService {
  private dogs: DogEntity[] = [
    {
      id: 1,
      name: '바둑이',
      age: 3,
    },
    {
      id: 2,
      name: '백구',
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

    this.dogs.push(dog);

    return dog;
  }
}
