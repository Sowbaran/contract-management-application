import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/index";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permissions } from "@src/permissions/permissions.model";

@Injectable()
export class PermissionsRepository extends AbstractRepository<Permissions> {
  protected readonly logger = new Logger(PermissionsRepository.name);
  constructor(
    @InjectModel(Permissions.name)
    permissionsModel: Model<Permissions>,
  ) {
    super(permissionsModel);
  }
}
