import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDTO } from "../dtos/user.dto";

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

  async create(user: CreateUserDTO): Promise<void> {
    const existingUser = await this.findOne(user.email);
    if (existingUser) throw new ConflictException();

    await this.user.insert(user).catch(() => {
      throw new InternalServerErrorException();
    });
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
    return user;
  }
}
