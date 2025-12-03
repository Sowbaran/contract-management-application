import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/index";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Departments } from "@src/departments/departments.model";

@Injectable()
export class DepartmentsRepository extends AbstractRepository<Departments> {
  protected readonly logger = new Logger(DepartmentsRepository.name);
  constructor(
    @InjectModel(Departments.name)
    departmentModel: Model<Departments>,
  ) {
    super(departmentModel);
  }
}
