import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Fox')
export class FoxEntity {
  @Field((type) => ID, {
    description: '아이디',
  })
  id: number;

  @Field((type) => String, {
    description: '이름',
  })
  name: string;

  @Field((type) => Int, {
    description: '나이',
  })
  age: number;
}
