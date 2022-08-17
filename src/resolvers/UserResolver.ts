import { User } from "../entities/User";
import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { AppDataSource } from "../DBConnection";
import type { MyContext } from "../utils/MyContext";
import * as argon2 from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@InputType()
class UserCreateInput {
  @Field()
  username: string;
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
  username: string;
  @Field({ nullable: true })
  picture: string;
  @Field(() => Int, { nullable: true })
  age: number;
  @Field({ nullable: true })
  gender: string;
  @Field()
  email: string;
}

@Resolver(User)
export default class UserResolver {
  @FieldResolver({ nullable: true })
  async posts(@Root() user: User, @Ctx() { postLoader }: MyContext) {
    const user_posts = await postLoader.load(user.user_id);
    return user_posts;
  }
  @Query(() => [User])
  async getUser(@Arg("user_id", { nullable: true }) user_id: string) {
    if (user_id) {
      const user = await AppDataSource.manager.find(User, {
        where: { user_id },
      });
      return user;
    }
    const users = await AppDataSource.manager.find(User);
    return users;
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
  @Mutation(() => User)
  async register(
    @Arg("options") options: UserCreateInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    // const errors = validateRegister(options);
    // if (errors) {
    //   return { errors };
    // }

    const hashedPassword = await argon2.hash(options.password);
    let user: User;
    try {
      user = User.create({
        username: options.username,
        email: options.email,
        password: hashedPassword,
      });
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.user_id;

    return { user };
  }
}
