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
  UseMiddleware,
} from "type-graphql";
import { AppDataSource } from "../DBConnection";
import type { MyContext } from "../utils/MyContext";
import * as argon2 from "argon2";
import { isAuth } from "../middleware/isAuth";

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

  // UPDATE USER
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
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
  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    // const errors = validateRegister(options);
    // if (errors) {
    //   return { errors };
    // }

    let user: User;
    try {
      const result: User = await User.findOneBy({
        email,
      });
      if (!result) {
        return {
          errors: [
            {
              field: "email",
              message: "email not found",
            },
          ],
        };
      }
      const passwordMatch = await argon2.verify(result.password, password);
      if (!passwordMatch) {
        return {
          errors: [
            {
              field: "password",
              message: "password does not match",
            },
          ],
        };
      }
      user = result;
    } catch (err) {
      console.log(err.message);
    }
    req.session.userId = user.user_id;

    return { user };
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserCreateInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user: User;
    try {
      const result = User.create({
        ...options,
      });
      await result.save();
      user = result;
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
      console.log(err.message);
    }

    req.session.userId = user.user_id;

    return { user };
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async logout(
    @Ctx() { req, res }: MyContext & { res: any }
  ): Promise<Boolean> {
    req.session.destroy();
    return true;
  }
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { req }: MyContext): Promise<User> {
    const user = await User.findOne({ where: { user_id: req.session.userId } });
    return user;
  }
}
