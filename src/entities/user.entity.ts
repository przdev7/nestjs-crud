import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { roles } from "../shared";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  // FIXME: Login issue
  /**
   * You can login with your email/username and password,
   * But when in db are 2 users with this same name you can
   * login only for this user account which one was created first
   *
   * potential solutions:
   * - restrict login only to email
   * - make username as PRIMARY KEY
   */
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column("enum", { array: true, enum: roles, nullable: false })
  roles: roles[] = [roles.USER];

  public async hashPassword(password: string): Promise<UserEntity> {
    this.password = await bcrypt.hash(password, 10);
    return this;
  }
}
