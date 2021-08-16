import { Module } from '@nestjs/common';
import { SchemaStitchingService } from './schema-stitching.service';

@Module({
  providers: [SchemaStitchingService],
  exports: [SchemaStitchingService],
})
export class SchemaStitchingModule {}
