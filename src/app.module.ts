import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.MAF_REDIS_HOST,
        port: parseInt(process.env.MAF_REDIS_PORT),
      },
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
