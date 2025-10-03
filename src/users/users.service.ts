import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly user: Repository<UserEntity>) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.user.find();
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.user.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException("user not found");
    return user;
  }

  async findOne(identifier: string): Promise<UserEntity | null> {
    const user = await this.user.findOne({
      where: [
        {
          username: identifier,
        },
        {
          email: identifier,
        },
      ],
    });
    if (!user) throw new NotFoundException("user not found");
    return user;
  }
}
