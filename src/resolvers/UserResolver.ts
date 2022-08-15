import { User } from "../entities/User";
import {
  Arg,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { AppDataSource } from "../DBConnection";

@InputType()
class UserCreateInput {
  @Field()
  first_name: string;
  @Field()
  last_name: string;
  @Field({ nullable: true })
  picture: string;
  @Field(() => Int)
  age: number;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field({ nullable: true })
  gender: string;
}
@InputType()
class UserUpdateInput {
  @Field({ nullable: true })
  first_name: string;
  @Field({ nullable: true })
  last_name: string;
  @Field({ nullable: true })
  picture: string;
  @Field(() => Int, { nullable: true })
  age: number;
  @Field({ nullable: true })
  gender: string;
  @Field()
  email: string;
}

@Resolver()
export default class UserResolver {
  @Query(() => [User])
  async getUser(
    @Arg("user_id", () => Int, { nullable: true }) user_id: string
  ) {
    if (user_id) {
      const user = await AppDataSource.manager.find(User, {
        where: { user_id },
      });
      return user;
    }
    const user = await User.find();
    return user;
  }

  // INSERT INTO User
  @Mutation(() => User)
  async createUser(
    @Arg("options", () => UserCreateInput) options: UserCreateInput
  ) {
    const user = AppDataSource.manager.create(User, { ...options }).save();
    return user;
  }

  // UPDATE USER
  @Mutation(() => Boolean)
  async updateUser(
    @Arg("user_id", () => ID) user_id: string,
    @Arg("options", () => UserUpdateInput) options: UserUpdateInput
  ) {
    try {
      await User.update({ user_id }, { ...options });
      return true;
    } catch (error) {
      return false;
    }
  }

  //  REMOVE FROM User
  @Mutation(() => Boolean)
  async removeUser(@Arg("user_id") user_id: string) {
    const user = await User.find({ where: { user_id } });
    if (!user) return false;
    await user[0].remove();
    return true;
  }
}
