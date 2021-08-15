import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Fox')
export class FoxEntity {
  @Field((type) => ID)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Int)
  age: number;
}
