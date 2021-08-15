import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './modules/cat/cat.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [CatModule, GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
