import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { SchemaStitchingModule } from '@lib/schema-stitching';
import { GraphqlOptions } from './graphql.options';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [SchemaStitchingModule],
      useClass: GraphqlOptions,
      inject: [SchemaStitchingModule],
    }),
  ],
})
export class GraphqlModule {}
