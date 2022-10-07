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
import { Account, PROVIDERS } from "../entities/Account";
import { githubProfileType } from "../utils/types";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { sendEmail } from "../lib/nodemailer/sendMail";

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
  accountRepository = dataSource.getRepository(Account);
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
  @UseMiddleware(isAuth)
  async verifyEmail(
    @Arg("email") email: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    /**
    - generate code
    - send it to user's email
    - store the code in the session
     
     */
    const verCode = Math.floor(Math.random() * 9000000) + 1000000;
    await sendEmail({
      from: "Dorten",
      to: email,
      subject: "Dorten Email Verification",
      text: `verification code is : ${verCode}`,
      html: `<h1>verification code is :</h1> <p style="font-weight:bold">${verCode}</p>`,
    });
    req.session.emailVerificationToken = verCode;
    return true;
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
      // get access_token
      const { data } = await axios.post(tokenUrl, {
        client_id: process.env.NEXT_PUBLIC_GITHUB_ID,
        client_secret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      });
      if (!data) return false;
      console.log({ data });
      // parse the response string to get token info
      const params = new URLSearchParams(data);
      const token_type = params.get("token_type");
      const access_token = params.get("access_token");
      const authHeader = `${token_type} ${access_token}`;
      console.log({ authHeader });
      // get user's github profile
      const ghUser = await axios.get(GITHUB_USER_URL, {
        headers: {
          Authorization: authHeader,
        },
      });
      if (!ghUser) return false;
      const githubUser: githubProfileType = ghUser.data;
      console.log({
        email: githubUser.email,
        name: githubUser.name,
        id: githubUser.id,
      });
      const dbUser = await this.userRepository.findOneBy({
        email: githubUser.email,
      });
      console.log({ found_user: dbUser?.username ?? "not found" });
      if (dbUser) {
        const githubAcc = dbUser.accounts.find((acc) => {
          acc.provider == "GITHUB";
        });
        if (!githubAcc) {
          await this.accountRepository
            .create({
              account_id: githubUser.id.toString(),
              provider: "GITHUB",
              user: dbUser,
            })
            .save();
        }
        req.session.userId = dbUser.user_id;
      } else {
        const userProfile = await this.userRepository
          .create({ username: githubUser.name, email: githubUser.email })
          .save();
        await this.accountRepository
          .create({
            account_id: githubUser.id.toString(),
            provider: "GITHUB",
            user: userProfile,
          })
          .save();
        //login
        req.session.userId = userProfile.user_id;
      }
      /**
       check if a user with same email already exists
       if it does:
          add profile to Accounts table and link it to the user
       if it doesn't:
          add profile to the Accounts table and also add it to the Users table
          and then link it together.

          later on if the user wants to log in with password and the password is empty in db
          make them verify email and then allow to set the password (basically a change password system).
       */
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
      if (!result?.password) {
        //return error indicating that user is settings the password
        //then handle it on the client by redirecting
        // 1. verifying the email
        // 2. double entering password (default input and re-type input)
        return {
          errors: [
            {
              field: "password",
              message: "user is trying to set a password to an oauth account",
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
