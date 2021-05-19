import { Test, TestingModule } from '@nestjs/testing';
import { VkIoService } from './vk-io.service';
import { VkIoModule } from './vk-io.module';
import { ConfigModule } from '@nestjs/config';
import 'jest-extended';

describe('VkIoService', () => {
  let service: VkIoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        VkIoModule.registerAsync({
          token: process.env.API_SERVICE_TOKEN,
        }),
      ],
    }).compile();

    service = module.get<VkIoService>(VkIoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be success request', async () => {
    expect(
      await service.api.users.get({
        user_ids: '152879324',
      }),
    ).toBeArray();
  });
});
