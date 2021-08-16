import { Injectable, Logger } from '@nestjs/common';
import { GraphQLSchema, print } from 'graphql';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { AsyncExecutor } from '@graphql-tools/utils/executor';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import * as ws from 'ws';
import { fetch } from 'cross-fetch';
import { getMainDefinition } from '@apollo/client/utilities';
import { RemoteServerUrlInfo } from './remote-server-url-info.interface';

@Injectable()
export class SchemaStitchingService {
  private readonly logger = new Logger(this.constructor.name);

  public getRemoteServerSchemas(
    remoteServerUrlInfoList: RemoteServerUrlInfo[],
  ): Promise<Array<GraphQLSchema | null>> {
    return Promise.all(
      remoteServerUrlInfoList.map((remoteServerUrlInfo) =>
        this.getRemoteServerSchema(remoteServerUrlInfo),
      ),
    );
  }

  private async getRemoteServerSchema(
    remoteServerUrlInfo: RemoteServerUrlInfo,
  ): Promise<GraphQLSchema | null> {
    this.logger.log(`Parse ${remoteServerUrlInfo.http_url}`);

    // 비동기 executor 를 생성합니다.
    // executor 는 들어온 요청을 원격에 있는 GraphQL 서버로 프록시해주는 함수입니다.
    const executor: AsyncExecutor =
      this.makeRemoteExecutor(remoteServerUrlInfo);

    // 원격 서버의 스키마와 executor 를 결합하여 원격 스키마를 생성합니다.
    // 원격 스키마는 요청이 들어오면 executor 를 호출해서 요청에 대한 결과를 가져옵니다.
    const remoteSchema = wrapSchema({
      schema: await introspectSchema(executor),
      executor,
    });

    return remoteSchema;
  }

  private makeRemoteExecutor(
    remoteServerUrlInfo: RemoteServerUrlInfo,
  ): AsyncExecutor {
    let link: ApolloLink;
    if (!remoteServerUrlInfo.ws_url) {
      link = new HttpLink({
        uri: remoteServerUrlInfo.http_url,
        fetch: fetch,
      });
    } else {
      const httpLink = new HttpLink({
        uri: remoteServerUrlInfo.http_url,
        fetch: fetch,
      });

      const wsLink = new WebSocketLink({
        uri: remoteServerUrlInfo.ws_url,
        options: {
          reconnect: true,
        },
        webSocketImpl: ws,
      });

      link = split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink,
      );
    }

    const apolloClient = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });

    return async ({ document, operationType, variables }) => {
      if (operationType == 'query') {
        this.logger.log(`Request ${remoteServerUrlInfo.http_url}`);

        // ApolloClient 클래스의 query 메서드를 사용하면 에러가 발생해서 일단 fetch 함수를 대신 사용합니다.
        //
        // const fetchResult = await apolloClient.query({
        //   query: document,
        //   variables: variables,
        // });
        //
        // return fetchResult;

        const query = print(document);

        const fetch_result = await fetch(remoteServerUrlInfo.http_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ query, variables }),
        });

        return fetch_result.json();
      }

      if (operationType == 'mutation') {
        this.logger.log(`Request ${remoteServerUrlInfo.http_url}`);

        const fetchResult = await apolloClient.mutate({
          mutation: document,
          variables,
        });

        return fetchResult;
      }

      this.logger.log(`Request to ${remoteServerUrlInfo.ws_url}`);

      const pending = [];
      let deferred = null;
      let error = null;
      let done = false;

      const subscription = apolloClient
        .subscribe({
          query: document,
          variables,
        })
        .subscribe({
          next: (data) => {
            pending.push(data);
            deferred && deferred.resolve(false);
          },
          error: (err) => {
            error = err;
            deferred && deferred.reject(error);
          },
          complete: () => {
            done = true;
            deferred && deferred.resolve(true);
          },
        });

      return {
        [Symbol.asyncIterator]() {
          return this;
        },
        async next() {
          if (done) return { done: true, value: undefined };
          if (error) throw error;
          if (pending.length) return { value: pending.shift() };
          return (await new Promise(
            (resolve, reject) => (deferred = { resolve, reject }),
          ))
            ? { done: true, value: undefined }
            : { value: pending.shift() };
        },
        async return() {
          subscription.unsubscribe();
          return { done: true, value: undefined };
        },
      };
    };
  }
}
