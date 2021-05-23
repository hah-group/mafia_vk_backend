import { Test, TestingModule } from '@nestjs/testing';
import { PublicGateway } from './public.gateway';

describe('PublicGateway', () => {
  let gateway: PublicGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicGateway],
    }).compile();

    gateway = module.get<PublicGateway>(PublicGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
