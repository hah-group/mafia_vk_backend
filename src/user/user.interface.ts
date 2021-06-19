import { User } from '@prisma/client';

export type UserInterface = Omit<User, 'vk_access_token'>;
