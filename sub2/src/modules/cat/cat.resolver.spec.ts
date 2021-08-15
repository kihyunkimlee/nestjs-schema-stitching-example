import { Test, TestingModule } from '@nestjs/testing';
import { CatResolver } from './cat.resolver';

describe('CatResolver', () => {
  let controller: CatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatResolver],
    }).compile();

    controller = module.get<CatResolver>(CatResolver);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
