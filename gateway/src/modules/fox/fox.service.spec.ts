import { Test, TestingModule } from '@nestjs/testing';
import { FoxService } from './fox.service';

describe('FoxService', () => {
  let service: FoxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoxService],
    }).compile();

    service = module.get<FoxService>(FoxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
