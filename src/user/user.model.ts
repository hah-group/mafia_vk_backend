import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  avatar_src?: string;
}
