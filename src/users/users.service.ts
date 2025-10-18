import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly user: Repository<UserEntity>) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.user.find();
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.user.findOne({ where: { id: id } });
    return user;
  }

  async findOne(identifier: string | number): Promise<UserEntity | null> {
    const user = await this.user.findOne({
      where:
        typeof identifier === "number"
          ? { id: identifier }
          : [
              {
                username: identifier,
              },
              {
                email: identifier,
              },
            ],
    });
    return user;
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const existingUser = await this.findOne(data.email);
    if (existingUser) throw new ConflictException();
    const user = await this.user.create(data).hashPassword(data.password);

    return await this.user.save(user);
  }

  async update(data: UserEntity): Promise<void> {
    await this.user.save(data);
  }
}
