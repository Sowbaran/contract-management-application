import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/index";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Roles } from "@src/roles/roles.model";

@Injectable()
export class RolesRepository extends AbstractRepository<Roles> {
  protected readonly logger = new Logger(RolesRepository.name);
  constructor(
    @InjectModel(Roles.name)
    rolesModel: Model<Roles>,
  ) {
    super(rolesModel);
  }
}
