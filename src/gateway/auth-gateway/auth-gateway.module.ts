import { Module } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../../user/user.module';

@Module({
  providers: [AuthGateway],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: { expiresIn: '6h' },
        secret: configService.get('APP_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthGatewayModule {}
