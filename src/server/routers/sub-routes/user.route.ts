import axios from "axios";
import { z } from "zod";
import {
  GITHUB_OAUTH_TOKEN_URL,
  GITHUB_USER_URL,
  OAUTH_SET_PASS_ERR_MSG,
} from "../../../../lib/variables";
import * as argon2 from "argon2";
import { zodEmail, zodPassword } from "../../../../lib/zod/zodTypes";
import { isAuthed, procedure, router } from "../index";
import { githubProfileType } from "../../../utils/types";
import { registerSchema } from "../../../../lib/zod/registerValidation";
import { sendEmail } from "../../nodemailer/sendMail";
import { prisma } from "../../../utils/prisma";

export const userRouter = router({
  githubLogin: procedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ input: { code }, ctx: { req } }) => {
      if (!code) return false;
      const tokenUrl = `${GITHUB_OAUTH_TOKEN_URL}?code=${code}`;
      // get access_token
      const { data } = await axios.post(tokenUrl, {
        client_id: process.env.NEXT_PUBLIC_GITHUB_ID,
        client_secret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      });
      if (!data) return false;
      // parse the response string to get token info
      const params = new URLSearchParams(data);
      const token_type = params.get("token_type");
      const access_token = params.get("access_token");
      const authHeader = `${token_type} ${access_token}`;
      // get user's github profile
      const ghUser = await axios.get(GITHUB_USER_URL, {
        headers: {
          Authorization: authHeader,
        },
      });
      if (!ghUser) return false;
      const githubUser: githubProfileType = ghUser.data;
      const dbUser = await prisma?.user.findFirst({
        where: { email: githubUser.email },
      });
      // check if an account exists with the same email as the github account
      if (dbUser) {
        const githubAcc = prisma?.account?.findFirst({
          where: { user: { user_id: dbUser.user_id }, provider: "GITHUB" },
        });
        if (!githubAcc) {
          await prisma?.account.create({
            data: {
              account_id: githubUser.id + "",
              provider: "GITHUB",
              user: {
                connectOrCreate: {
                  where: { user_id: dbUser.user_id },
                  create: dbUser,
                },
              },
            },
          });
        }
        req.session.userId = dbUser.user_id;
      } else {
        // if the user is logging in for the first time with github

        // create user with github email
        const userProfile = await prisma?.user.create({
          data: { username: githubUser.name, email: githubUser.email },
        });
        // create account associated with that user
        await prisma?.account.create({
          data: {
            account_id: githubUser.id.toString(),
            provider: "GITHUB",
            user: { create: userProfile },
          },
        });
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
    }),
  login: procedure
    .input(
      z.object({
        email: zodEmail,
        password: zodPassword,
      })
    )
    .mutation(async ({ input: { email, password }, ctx: { req } }) => {
      let user;
      try {
        console.log({ email, password });
        const result = await prisma.user.findFirst({
          where: { email },
        });
        if (result == null) {
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
          //return error indicating that user is setting the password
          //then handle it on the client by redirecting
          // 1. verifying the email
          // 2. double entering password (default input and re-type input)
          return {
            errors: [
              {
                field: "password",
                message: OAUTH_SET_PASS_ERR_MSG,
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
        console.log({ errorISREAL: err });
      }
      if (!user)
        return { errors: [{ field: "email", message: "email not found" }] };
      req.session.userId = user.user_id;

      return { user };
    }),
  register: procedure
    .input(registerSchema)
    .mutation(async ({ input, ctx: { req } }) => {
      let user;
      try {
        const hashedPassword = await argon2.hash(input.password);
        const result = await prisma.user.create({
          data: {
            ...input,
            password: hashedPassword,
          },
        });
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
        console.log({ error: err.message });
      }
      if (!user)
        return {
          errors: [{ field: "general", message: "something went wrong" }],
        };
      req.session.userId = user.user_id;

      return { user };
    }),
  logout: procedure.use(isAuthed).mutation(({ ctx: { req } }) => {
    req.session.destroy();
    return true;
  }),
  me: procedure.use(isAuthed).query(async ({ ctx: { req } }) => {
    const user = await prisma.user.findFirst({
      where: { user_id: req.session.userId },
    });
    return user;
  }),
  verifyCode: procedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ input: { code }, ctx: { req } }) => {
      if (req.session.emailVerificationToken != parseInt(code)) return false;
      req.session.emailVerificationToken = null;
      await prisma.user.update({
        where: { user_id: req.session.userId },
        data: { email_verified: true },
      });
      return true;
    }),
  changePassword: procedure
    .use(isAuthed)
    .input(
      z.object({
        newPassword: zodPassword,
      })
    )
    .mutation(async ({ input: { newPassword }, ctx: { req } }) => {
      const user = await prisma.user.findFirst({
        where: { user_id: req.session.userId },
      });
      if (!user?.email_verified) {
        return {
          success: false,
          errors: [
            {
              field: "general",
              message: "Email not verified",
            },
          ],
        };
      }

      await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          password: await argon2.hash(newPassword),
        },
      });

      // log in user after change password
      // req.session.userId = user.user_id;

      return { success: true };
    }),
  getUserByUsername: procedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ input: { username }, ctx: { req } }) => {
      const user = await prisma.user.findFirst({ where: { username } });
      return user || null;
    }),
  updateUser: procedure
    .use(isAuthed)
    .input(
      z.object({
        username: z.string().optional(),
        picture: z.string().optional(),
        age: z.string().optional(),
        gender: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx: { req } }) => {
      const user_id = req.session.userId;
      const curr_user = await prisma.user.findFirst({
        where: { user_id },
      });
      if (!curr_user)
        return { errors: [{ field: "general", message: "user not found" }] };
      const updates = Object.assign(curr_user, input);
      await prisma.user.update({ where: { user_id }, data: { ...updates } });
    }),
  verifyEmail: procedure
    .use(isAuthed)
    .input(
      z.object({
        email: zodEmail,
      })
    )
    .mutation(async ({ input: { email }, ctx: { req } }) => {
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
    }),
});
