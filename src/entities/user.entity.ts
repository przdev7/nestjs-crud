import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  public async hashPassword(password: string): Promise<UserEntity> {
    this.password = await bcrypt.hash(password, 10);
    return this;
  }
}
