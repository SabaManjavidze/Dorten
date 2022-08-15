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

  @Field()
  @Column()
  creator_id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: Promise<User>;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  async addPostId() {
    this.post_id = v4();
  }
}
