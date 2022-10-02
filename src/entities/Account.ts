import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
export const PROVIDERS = ["GOOGLE", "GITHUB"];
import type { Relation } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Account extends BaseEntity {
  @ManyToOne(() => User, (user) => user.user_id)
  user: Relation<User>;

  @Field()
  @Column({
    type: "enum",
    enum: Object.values(PROVIDERS),
  })
  provider: string;

  @Field()
  @PrimaryColumn()
  account_id: string;

  @CreateDateColumn()
  created_at: Date;
}
