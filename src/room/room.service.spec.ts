import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
