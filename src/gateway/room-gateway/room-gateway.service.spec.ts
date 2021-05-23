import { Test, TestingModule } from '@nestjs/testing';
import { RoomGatewayService } from './room-gateway.service';

describe('RoomGatewayService', () => {
  let service: RoomGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomGatewayService],
    }).compile();

    service = module.get<RoomGatewayService>(RoomGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
