import { Ctx, Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import { v4 } from "uuid";
import { User } from "./User";
import { Post } from "./Post";
import type { MyContext } from "../utils/MyContext";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryColumn()
  comment_id: string;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  post_id: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comments)
  post: Relation<Post>;

  @Field()
  @Column()
  creator_id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  creator: Relation<User>;

  @Field(() => String)
  @CreateDateColumn()
  created_at: string;

  @BeforeInsert()
  addUserId() {
    if (!this.comment_id) {
      this.comment_id = v4();
    }
  }
}
