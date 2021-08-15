import { Test, TestingModule } from '@nestjs/testing';
import { FoxResolver } from './fox.resolver';

describe('FoxResolver', () => {
  let resolver: FoxResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoxResolver],
    }).compile();

    resolver = module.get<FoxResolver>(FoxResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
