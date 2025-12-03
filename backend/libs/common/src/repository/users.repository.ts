import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/index";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Users } from "@src/users/users.model";

@Injectable()
export class UsersRepository extends AbstractRepository<Users> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectModel(Users.name)
    usersModel: Model<Users>,
  ) {
    super(usersModel);
  }
}
