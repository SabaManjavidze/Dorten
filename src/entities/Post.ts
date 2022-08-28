import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
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
  creator: Relation<User>[];

  @Field(() => String)
  @CreateDateColumn()
  created_at: string;

  @BeforeInsert()
  async addPostId() {
    this.post_id = v4();
  }
}
