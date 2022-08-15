import { Field, ID, Int, ObjectType, Resolver } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
export const GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  NONE: "NONE",
};
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
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

  @Field()
  @Column()
  age: number;

  @Field({ nullable: true })
  @Column({
    type: "enum",
    enum: Object.values(GENDERS),
    default: GENDERS.NONE,
  })
  gender: string;
}
