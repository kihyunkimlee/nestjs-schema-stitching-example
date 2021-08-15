import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { FoxModule } from './modules/fox/fox.module';

@Module({
  imports: [GraphqlModule, FoxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
