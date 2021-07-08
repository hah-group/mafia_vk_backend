import { Test, TestingModule } from '@nestjs/testing';
import { SizeRuleService } from './size-rule.service';

describe('SizeRuleService', () => {
  let service: SizeRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SizeRuleService],
    }).compile();

    service = module.get<SizeRuleService>(SizeRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
