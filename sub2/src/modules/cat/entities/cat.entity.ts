import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Cat')
export class CatEntity {
  @Field((type) => ID)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Int)
  age: number;
}
