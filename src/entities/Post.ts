import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 } from "uuid";
import { User } from "./User";

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
  // many to one relationship with user
  @Field(() => User)
  @Column({ nullable: true })
  creator_id: string;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  async addPostId() {
    this.post_id = v4();
  }
}
