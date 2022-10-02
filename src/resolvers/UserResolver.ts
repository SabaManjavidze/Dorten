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
import type { MyContext } from "../utils/MyContext";
import * as argon2 from "argon2";
import { isAuth } from "../middleware/isAuth";
import dataSource from "../DBConnection";
import axios from "axios";
import { GITHUB_OAUTH_TOKEN_URL, GITHUB_USER_URL } from "../../lib/variables";

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
  username?: string;
  @Field({ nullable: true })
  picture?: string;
  @Field(() => Int, { nullable: true })
  age?: number;
  @Field({ nullable: true })
  gender?: string;
  @Field({ nullable: true })
  email?: string;
}

@Resolver(User)
export default class UserResolver {
  userRepository = dataSource.getRepository(User);
  @FieldResolver({ nullable: true })
  async posts(@Root() user: User, @Ctx() { postLoader }: MyContext) {
    const user_posts = await postLoader.load(user.user_id);
    return user_posts;
  }
  @Query(() => User!, { nullable: true })
  async getUserByUsername(@Arg("username") username: string) {
    const user = await this.userRepository.find({ where: { username } });
    if (user.length > 0) return user[0];
    else return null;
  }
  // UPDATE USER
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateUser(
    @Ctx() { req }: MyContext,
    @Arg("options", () => UserUpdateInput) options: UserUpdateInput
  ) {
    try {
      const user_id = req.session.userId;
      const curr_user = await this.userRepository.findOne({
        where: { user_id },
      });
      if (!curr_user)
        return { errors: [{ field: "general", message: "user not found" }] };
      const updates = Object.assign(curr_user, options);
      await this.userRepository.update({ user_id }, { ...updates });
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async githubLogin(
    @Arg("code") code: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      if (!code) return false;
      const tokenUrl = `${GITHUB_OAUTH_TOKEN_URL}?code=${code}`;
      console.log({ tokenUrl });
      const { data } = await axios.post(tokenUrl, {
        client_id: process.env.NEXT_PUBLIC_GITHUB_ID,
        client_secret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      });
      if (!data) return false;
      console.log({ data });
      const params = new URLSearchParams(data);
      const token_type = params.get("token_type");
      const access_token = params.get("access_token");
      const authHeader = `${token_type} ${access_token}`;
      console.log({ authHeader });
      const user = await axios.get(GITHUB_USER_URL, {
        headers: {
          Authorization: authHeader,
        },
      });
      console.log({ user });
      return true;
    } catch (error) {
      throw new Error(error + "");
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user: User | null = null;
    try {
      const result: User | null = await this.userRepository.findOneBy({
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
    } catch (err: any) {
      console.log(err.message);
    }
    if (!user)
      return { errors: [{ field: "email", message: "email not found" }] };
    req.session.userId = user.user_id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserCreateInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user: User | null = null;
    try {
      if (!options.email.includes("@")) {
        return {
          errors: [
            {
              field: "email",
              message: "email is not valid",
            },
          ],
        };
      }
      const result = this.userRepository.create({
        ...options,
      });
      await result.save();
      user = result;
    } catch (err: any) {
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
    if (!user)
      return {
        errors: [{ field: "general", message: "something went wrong" }],
      };
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
  @Query(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { req }: MyContext): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { user_id: req.session.userId },
    });
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "user not found",
          },
        ],
      };
    }
    return { user };
  }
}
