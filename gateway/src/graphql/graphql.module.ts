import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      cors: true,
      autoSchemaFile: join(process.cwd(), 'src/autogen/schema.gql'),
      installSubscriptionHandlers: true,
    }),
  ],
})
export class GraphqlModule {}
