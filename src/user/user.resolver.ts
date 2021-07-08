import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return await this.userService.user({
      where: {
        id: Number(id),
      },
    });
  }
}
