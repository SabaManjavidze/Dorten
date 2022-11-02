import { Field, ID, Int, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import * as argon2 from "argon2";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Post } from "./Post";
import { Like } from "./Like";
export const GENDERS = {
  MALE: "Male",
  FEMALE: "Female",
  NONE: "None",
};
import type { Relation } from "typeorm";
import { Account } from "./Account";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  user_id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  picture: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  age: number;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.creator)
  posts: Relation<Post[]>;

  @Field(() => [Account], { nullable: true })
  @OneToMany(() => Account, (account) => account.user)
  accounts: Relation<Account[]>;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like;

  @Field({ nullable: true })
  @Column({
    type: "enum",
    enum: Object.values(GENDERS),
    default: GENDERS.NONE,
  })
  gender: string;

  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  addUserId() {
    if (!this.user_id) {
      this.user_id = v4();
    }
  }
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password, { hashLength: 16 });
    }
  }
}
