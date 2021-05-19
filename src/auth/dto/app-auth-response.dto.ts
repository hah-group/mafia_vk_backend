import { User } from '@prisma/client';

export class AppAuthResponseDto {
  access_token: string;
  User: User;
}
