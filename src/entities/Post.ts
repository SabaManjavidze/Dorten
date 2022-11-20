import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import { v4 } from "uuid";
import { Like } from "./Like";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field()
  @PrimaryColumn()
  post_id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  picture: string;

  @Field()
  @Column()
  creator_id: string;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Relation<Comment[]>;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: Relation<User>;

  @Field()
  @Column({ type: "int", default: 0 })
  points: number;

  @Field(() => Int, { nullable: true })
  likeStatus: number | null;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @Field(() => String)
  @CreateDateColumn()
  created_at: string;

  @BeforeInsert()
  async addPostId() {
    this.post_id = v4();
  }
}
