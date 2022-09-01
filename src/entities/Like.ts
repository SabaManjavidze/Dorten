import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import type { Relation } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Like extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.likes)
  user: Relation<User>;

  @PrimaryColumn()
  postId: string;

  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: "CASCADE",
  })
  post: Relation<Post>;
}
