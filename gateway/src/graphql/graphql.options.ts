import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { SchemaStitchingService } from '../../libs/schema-stitching/src/schema-stitching.service';
import { join } from 'path';
import { GraphQLSchema } from 'graphql';
import { stitchSchemas } from '@graphql-tools/stitch';
import { RemoteServerUrlInfo } from '../../libs/schema-stitching/src/remote-server-url-info.interface';

const remoteServerUrlInfoList: RemoteServerUrlInfo[] = [
  {
    http_url: 'http://sub1:3001/graphql',
  },
  {
    http_url: 'http://sub2:3002/graphql',
    ws_url: 'ws://sub2:3002/graphql',
  },
];

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  constructor(private readonly stitchingService: SchemaStitchingService) {}

  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      cors: true,
      autoSchemaFile: join(process.cwd(), 'src/autogen/schema.gql'),
      installSubscriptionHandlers: true,
      transformSchema: async (schema: GraphQLSchema) => {
        // 원격 서버의 GraphQL 스키마를 가져옵니다.
        const remoteServerSchemas: GraphQLSchema[] = (
          await this.stitchingService.getRemoteServerSchemas(
            remoteServerUrlInfoList,
          )
        ).filter(Boolean);

        // 게이트웨이 서버의 GraphQL 스키마와 원격 서버의 GraphQL 스키마를 결합하여 하나의 상위 GraphQL 스키마를 생성합니다.
        const superschema = stitchSchemas({
          subschemas: [schema, ...remoteServerSchemas],
        });

        // 상위 GraphQL 스키마를 스키마 변환의 결과값으로 반환합니다.
        return superschema;
      },
    };
  }
}
