import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
export enum PROVIDERS {
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
}
export type ProvidersType = "GOOGLE" | "GITHUB";
import type { Relation } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Account extends BaseEntity {
  @ManyToOne(() => User, (user) => user.user_id)
  user: Relation<User>;

  @Field(() => String)
  @Column({
    type: "enum",
    enum: PROVIDERS,
  })
  provider: ProvidersType;

  @Field()
  @PrimaryColumn()
  account_id: string;

  @CreateDateColumn()
  created_at: Date;
}
