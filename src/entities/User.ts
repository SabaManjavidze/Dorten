import { Field, ID, Int, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";
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
export const GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  NONE: "NONE",
};
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  user_id: string;

  @Field()
  @Column()
  first_name: string;

  @Field()
  @Column()
  last_name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  picture: string;

  @Field(() => Int)
  @Column()
  age: number;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

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
    this.user_id = v4();
  }
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
