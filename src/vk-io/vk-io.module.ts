import { DynamicModule, Module } from '@nestjs/common';
import { IAPIOptions } from 'vk-io/lib/api/api';
import { VkIoService } from './vk-io.service';
import { VK_IO_OPTION } from './constants';

@Module({})
export class VkIoModule {
  static registerAsync(options: Partial<IAPIOptions>): DynamicModule {
    return {
      module: VkIoModule,
      providers: [
        {
          provide: VK_IO_OPTION,
          useValue: options,
        },
        VkIoService,
      ],
      exports: [VkIoService],
    };
  }
}
