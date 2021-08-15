import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DogModule } from './modules/dog/dog.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [DogModule, GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
