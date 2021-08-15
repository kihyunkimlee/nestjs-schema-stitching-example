import { Test, TestingModule } from '@nestjs/testing';
import { DogResolver } from './dog.resolver';

describe('DogResolver', () => {
  let resolver: DogResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DogResolver],
    }).compile();

    resolver = module.get<DogResolver>(DogResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
