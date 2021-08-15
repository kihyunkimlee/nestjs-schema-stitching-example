import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Dog')
export class DogEntity {
  @Field((type) => ID)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Int)
  age: number;
}
