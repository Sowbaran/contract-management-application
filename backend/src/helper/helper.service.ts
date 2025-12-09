import {
  DepartmentsRepository,
  RolesRepository,
  FormDetailsRepository,
  WorkflowRepository,
  UsersRepository,
  FormModuleRepository,
  PermissionsRepository,
} from "@app/common";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ObjectId, Types } from "mongoose";
import {
  ROLECODES,
  TabRequest,
  PermissionCodes,
  FormStatus,
  DEPARTMENTCODES,
  ModuleCode,
  SettingsRequest,
  DocusignStatus,
  FormHistoryStatus,
  ApiCode,
  EmailStatus,
  NotRequiredGM,
} from "../constants";
import { UserDepartment } from "@src/users/users.model";

interface RoleCheckResult {
  isSuperAdmin: boolean;
  isModuleAdmin: boolean;
  isFinanceAdmin: boolean;
}

interface Department {
  _id: Types.ObjectId;
  name: string;
  roles: Role[];
}

interface Permission {
  moduleId: Types.ObjectId;
  moduleName: string;
  moduleCode: string;
  moduleStatus: boolean;
  permissionCode: string;
  status: boolean;
}

interface Role {
  _id: Types.ObjectId;
  name: string;
  code: string;
  status: boolean;
  permissions?: Permission[];
}

interface Module {
  _id: Types.ObjectId;
  name: string;
  code: string;
  status: boolean;
  permissions: string[];
}

@Injectable()
export class HelperService {
  protected readonly logger = new Logger(HelperService.name);
  constructor(
    private rolesRepo: RolesRepository,
    private departmentsRepository: DepartmentsRepository,
    private usersRepo: UsersRepository,
    private workFlowRepo: WorkflowRepository,
    private permissionsRepo: PermissionsRepository,
    private formModuleRepository: FormModuleRepository,
  ) {}

  async validateUserPermissions(
    emailId: string,
    type: string,
    departments: UserDepartment[],
    moduleCode: string,
    permissionCode: string,
    moduleId: string,
    formId?: string,
    apiType?: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ): Promise<any> {
    // Validate departments for non-MYREQUEST types
    if (!departments?.length && type !== TabRequest.MYREQUEST) {
      throw new ForbiddenException(`You do not have the required permissions`);
    }
 
    // Compute role and department IDs once for reuse
    const departmentIds = departments?.map((dept) => dept._id) || [];
    // const userRoleIds =
    //   departments?.flatMap((dept) =>
    //     dept.roles.map((role: { _id: ObjectId }) => role._id),
    //   ) || [];
 
    const deptRolePairs = departments.flatMap((dept) =>
      dept.roles.map((role) => ({
        roleId: role._id,
        departmentId: dept._id,
      })),
    );
 
    const userRoleIds = deptRolePairs.map((pair) => pair.roleId);
 
    // Role Check Result
    const roleCheckResult = await this.checkUserRoles(departments, moduleCode);
    this.logger.log(`Approval Roles ${JSON.stringify(roleCheckResult)}`);
    const isAllAccess =
      roleCheckResult.isSuperAdmin || roleCheckResult.isModuleAdmin;
    const isAdditionalAccess = roleCheckResult.isFinanceAdmin;
 
    // Validate permissions
    const hasPermission = await this.validatePermission(
      moduleCode,
      permissionCode,
      moduleId,
      departments,
    );
    if (!hasPermission) {
      throw new ForbiddenException(`Invalid Permission`);
    }
 
    // Base query criteria
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const queryCriteria: any = { moduleId, active: true };
    if (formId) queryCriteria._id = formId;
 
    // Construct query criteria based on type
    switch (type) {
      case TabRequest.MYREQUEST:
        queryCriteria.status = { $ne: FormStatus.DELETED };
        queryCriteria.createdBy = emailId;
        break;
 
      case TabRequest.APPROVEREQUEST:
        queryCriteria.status = FormStatus.PENDING;
        if (!isAllAccess) {
          this.logger.log(`userRoleIds, ${JSON.stringify(userRoleIds)}`);
          queryCriteria.$or = [
            {
              workflowOrder: {
                $elemMatch: {
                  roleId: { $in: userRoleIds },
                  isSpecificDeptApprover: false,
                  status: FormStatus.PENDING,
                },
              },
              workflow: { $in: userRoleIds },
            },
             /*{
              $or: deptRolePairs.map((pair) => ({
                workflowOrder: {
                  $elemMatch: {
                    isSpecificDeptApprover: true,
                    status: FormStatus.PENDING,
                    roleId: pair.roleId,
                  },
                },
                department: pair.departmentId,
                workflow: pair.roleId,
              })),
            },*/
            {
              $or: [
                // Case 1: includeOnRequesterCheck: true
                {
                  workflowOrder: {
                    $elemMatch: {
                      status: FormStatus.PENDING,
                      includeOnRequesterCheck: true,
                      // Ensure the roleId of this workflowOrder element matches specificApproverDetails.roleId
                      //roleId: { $eq: "$specificApproverDetails.roleId" },
                    },
                  },
                  "specificApproverDetails.email": emailId,
                },
                // Case 2: isSpecificDeptApprover: true and includeOnRequesterCheck: false (or not true)
                // Apply department and workflow conditions
                ...deptRolePairs.map((pair) => ({
                  workflowOrder: {
                    $elemMatch: {
                      isSpecificDeptApprover: true,
                      status: FormStatus.PENDING,
                      roleId: pair.roleId,
                      includeOnRequesterCheck: { $ne: true },
                    },
                  },
                  department: pair.departmentId,
                  workflow: pair.roleId,
                })),
              ],
            },
          ];
        }
        break;
 
      case TabRequest.TEAMREQUEST:
        queryCriteria.status = { $nin: [FormStatus.DRAFT, FormStatus.DELETED] };
        if (!isAllAccess && !isAdditionalAccess) {
          queryCriteria.department = { $in: departmentIds };
        }
        break;
      case TabRequest.MYAPPROVEDLIST:
        // Keep the original status condition
        queryCriteria.status = { $nin: [FormStatus.DRAFT, FormStatus.DELETED] };
        // Check the entire formHistory array for a matching entry
        queryCriteria.$and = [
          {
            formHistory: {
              $elemMatch: {
                status: {
                  $in: [
                    EmailStatus.APPROVED,
                    DocusignStatus.ESIGNINITIATED,
                    FormStatus.REJECTED,
                  ],
                },
                approvedBy: emailId,
              },
            },
          },
        ];
        break;
      // DOCUSIGN ESIGNREQUEST CASE COMMENTED OUT - DocuSign is disabled
      // ESIGNREQUEST tab will return empty results since no forms will have ESIGNINITIATED status
      case TabRequest.ESIGNREQUEST:
        // Return empty query (no results) since DocuSign is disabled
        queryCriteria._id = new Types.ObjectId("000000000000000000000000"); // Non-existent ID to return empty results
        break;
        // if (isAllAccess) {
        //   queryCriteria.status = DocusignStatus.ESIGNINITIATED;
        // } else if (apiType !== ApiCode.RESET) {
        //   this.logger.log(`userRoleIds, ${JSON.stringify(userRoleIds)}`);
        //   queryCriteria.$and = [
        //     { status: DocusignStatus.ESIGNINITIATED, active: true },
        //     // Condition 1: Workflow check
        //     {
        //       $or: [
        //         {
        //           workflowOrder: {
        //             $elemMatch: {
        //               roleId: { $in: userRoleIds },
        //               status: FormStatus.PENDING,
        //             },
        //           },
        //           workflow: { $in: userRoleIds },
        //         },
        //         {
        //           workflowOrder: {
        //             $elemMatch: {
        //               isSpecificDeptApprover: true,
        //               status: FormStatus.PENDING,
        //               roleId: { $in: userRoleIds },
        //             },
        //           },
        //           department: { $in: departmentIds },
        //           workflow: { $in: userRoleIds },
        //         },
        //       ],
        //     },
        //     {
        //       $expr: {
        //         $and: [
        //           {
        //             $gt: [
        //               {
        //                 $size: {
        //                   $filter: {
        //                     input: "$formHistory",
        //                     as: "history",
        //                     cond: {
        //                       $or: [
        //                         {
        //                           $eq: [
        //                             "$$history.status",
        //                             DocusignStatus.ESIGNINITIATED,
        //                           ],
        //                         },
        //                         {
        //                           $eq: [
        //                             "$$history.status",
        //                             FormHistoryStatus.Retriggered,
        //                           ],
        //                         },
        //                       ],
        //                     },
        //                   },
        //                 },
        //               },
        //               0,
        //             ],
        //           },
        //           {
        //             $in: [
        //               emailId,
        //               {
        //                 $cond: [
        //                   {
        //                     $eq: [
        //                       { $arrayElemAt: ["$formHistory.status", -1] },
        //                       DocusignStatus.ESIGNINITIATED,
        //                     ],
        //                   },
        //                   [
        //                     {
        //                       $arrayElemAt: [
        //                         {
        //                           $map: {
        //                             input: "$formHistory",
        //                             as: "h",
        //                             in: "$$h.approvedBy",
        //                           },
        //                         },
        //                         -1,
        //                       ],
        //                     },
        //                   ],
        //                   {
        //                     $cond: [
        //                       {
        //                         $eq: [
        //                           { $arrayElemAt: ["$formHistory.status", -2] },
        //                           DocusignStatus.ESIGNINITIATED,
        //                         ],
        //                       },
        //                       [
        //                         {
        //                           $arrayElemAt: [
        //                             {
        //                               $map: {
        //                                 input: "$formHistory",
        //                                 as: "h",
        //                                 in: "$$h.approvedBy",
        //                               },
        //                             },
        //                             -2,
        //                           ],
        //                         },
        //                       ],
        //                       {
        //                         $slice: [
        //                           {
        //                             $map: {
        //                               input: "$formHistory",
        //                               as: "h",
        //                               in: "$$h.approvedBy",
        //                             },
        //                           },
        //                           -2,
        //                         ],
        //                       },
        //                     ],
        //                   },
        //                 ],
        //               },
        //             ],
        //           },
        //         ],
        //       },
        //     },
        //   ];
        // } else {
        //   throw new ForbiddenException(
        //     "Invalid permissions for ESIGN request reset",
        //   );
        // }
        // break;
 
      default:
        throw new BadRequestException(`Invalid request type: ${type}`);
    }
 
    return {
      queryCriteria,
      isAllAccess,
      isAdditionalAccess,
      roleCheckResult,
    };
  }
  // Common functions for all the API permission check based on moduleId
  getSettingsPermissionCode(
    type: string,
    moduleType: keyof typeof PermissionCodes,
  ): string {
    const permissionCodes = PermissionCodes[moduleType];
    if (
      "VIEWUSERSETTINGS" in permissionCodes &&
      "VIEWDEPARTMENTSETTINGS" in permissionCodes &&
      "VIEWROLESETTINGS" in permissionCodes &&
      "VIEWPERMISSIONSETTINGS" in permissionCodes &&
      "VIEWMODULESETTINGS" in permissionCodes
    ) {
      switch (type) {
        case SettingsRequest.VIEWUSERSETTINGS:
          return permissionCodes.VIEWUSERSETTINGS;
        case SettingsRequest.VIEWDEPARTMENTSETTINGS:
          return permissionCodes.VIEWDEPARTMENTSETTINGS;
        case SettingsRequest.VIEWROLESETTINGS:
          return permissionCodes.VIEWROLESETTINGS;
        case SettingsRequest.VIEWPERMISSIONSETTINGS:
          return permissionCodes.VIEWPERMISSIONSETTINGS;
        case SettingsRequest.VIEWMODULESETTINGS:
          return permissionCodes.VIEWMODULESETTINGS;
        default:
          throw new BadRequestException(`Invalid type: ${type}`);
      }
    }

    throw new BadRequestException(
      `Module type ${moduleType} does not support request types like MYREQUEST.`,
    );
  }

  // Common functions for all the API permission check based on moduleId
  getPermissionCode(
    type: string,
    moduleType: keyof typeof PermissionCodes,
  ): string {
    const permissionCodes = PermissionCodes[moduleType];
    if (moduleType === "HEADCOUNT") {
      // Narrow the type to ensure `MYREQUEST`, `TEAMREQUEST`, `APPROVEREQUEST` exist
      if (
        "MYREQUEST" in permissionCodes &&
        "TEAMREQUEST" in permissionCodes &&
        "APPROVEREQUEST" in permissionCodes &&
        "VIEWCONFIGURATION" in permissionCodes
      ) {
        switch (type) {
          case TabRequest.MYREQUEST:
            return permissionCodes.MYREQUEST;
          case TabRequest.TEAMREQUEST:
            return permissionCodes.TEAMREQUEST;
          case TabRequest.APPROVEREQUEST:
            return permissionCodes.APPROVEREQUEST;
          case TabRequest.VIEWCONFIGURATION:
            return permissionCodes.VIEWCONFIGURATION;
          default:
            throw new BadRequestException(`Invalid type: ${type}`);
        }
      }
    } else if (moduleType === "CONTRACT") {
      // Narrow the type to ensure `MYREQUEST`, `TEAMREQUEST`, `APPROVEREQUEST` , `MYAPPROVEDREQUEST` and `VIEWMYESIGNREQUEST` exist
      if (
        "MYREQUEST" in permissionCodes &&
        "TEAMREQUEST" in permissionCodes &&
        "APPROVEREQUEST" in permissionCodes &&
        "VIEWCONFIGURATION" in permissionCodes &&
        "MYAPPROVEDREQUEST" in permissionCodes &&
        "VIEWMYESIGNREQUEST" in permissionCodes
      ) {
        switch (type) {
          case TabRequest.MYREQUEST:
            return permissionCodes.MYREQUEST;
          case TabRequest.TEAMREQUEST:
            return permissionCodes.TEAMREQUEST;
          case TabRequest.APPROVEREQUEST:
            return permissionCodes.APPROVEREQUEST;
          case TabRequest.VIEWCONFIGURATION:
            return permissionCodes.VIEWCONFIGURATION;
          case TabRequest.MYAPPROVEDLIST:
            return permissionCodes.MYAPPROVEDREQUEST;
          case TabRequest.ESIGNREQUEST:
            return permissionCodes.VIEWMYESIGNREQUEST;
          default:
            throw new BadRequestException(`Invalid type: ${type}`);
        }
      }
    }

    // Narrow the type to ensure `MYREQUEST`, `TEAMREQUEST`, `APPROVEREQUEST` , `MYAPPROVEDREQUEST` and `VIEWMYESIGNREQUEST` exist

    throw new BadRequestException(
      `Module type ${moduleType} does not support request types ${type}.`,
    );
  }

  public async validatePermission(
    moduleCode: string,
    permissionCode: string,
    moduleId: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    departments: any[],
  ): Promise<boolean> {
    try {
      const modulePermissionCodes = this.getModulePermissionCodes();
      this.validateModuleCode(moduleCode, modulePermissionCodes);
      this.validatePermissionCode(
        moduleCode,
        permissionCode,
        modulePermissionCodes,
      );

      if (!departments || departments.length === 0) {
        return await this.checkGuestUserPermission(permissionCode, moduleId);
      }
      return await this.checkUserPermissions(
        departments,
        permissionCode,
        moduleId,
      );
    } catch (err) {
      this.logger.warn(`You do not have the required permissions`);
      return false;
    }
  }

  private getModulePermissionCodes(): Record<string, string[]> {
    return {
      contract: Object.values(PermissionCodes.CONTRACT),
      headcount: Object.values(PermissionCodes.HEADCOUNT),
      settings: Object.values(PermissionCodes.SETTINGS),
    };
  }

  private validateModuleCode(
    moduleCode: string,
    modulePermissionCodes: Record<string, string[]>,
  ): void {
    if (!modulePermissionCodes[moduleCode]) {
      throw new ForbiddenException(`Invalid module code: ${moduleCode}`);
    }
  }

  private async validatePermissionCode(
    moduleCode: string,
    permissionCode: string,
    modulePermissionCodes: Record<string, string[]>,
  ): Promise<void> {
    if (!modulePermissionCodes[moduleCode].includes(permissionCode)) {
      throw new ForbiddenException(
        `Invalid permission code: ${permissionCode} for module: ${moduleCode}`,
      );
    }
  }

  private async checkGuestUserPermission(
    permissionCode: string,
    moduleId: string,
  ): Promise<boolean> {
    const guestRole = await this.rolesRepo.findOne({
      code: ROLECODES.GUESTUSER,
    });
    if (!guestRole) {
      throw new ForbiddenException(`Guest user role not defined`);
    }
    return guestRole.permissions.some(
      (perm) =>
        perm.permissionCode === permissionCode &&
        perm.moduleId.toString() === moduleId &&
        perm.moduleStatus === true,
    );
  }

  private async checkUserPermissions(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    departments: any[],
    permissionCode: string,
    moduleId: string,
  ): Promise<boolean> {
    for (const department of departments) {
      for (const role of department.roles) {
        const hasPermission = role.permissions.some(
          (perm: {
            permissionCode: string;
            moduleId: { toString: () => string };
            moduleStatus: boolean;
          }) =>
            perm.permissionCode === permissionCode &&
            perm.moduleId.toString() === moduleId &&
            perm.moduleStatus === true,
        );
        if (hasPermission) {
          return true;
        }
      }
    }
    return false;
  }

  public async checkUserRoles(
    userDepartments: Department[],
    moduleCode: string,
  ): Promise<RoleCheckResult> {
    let isSuperAdmin = false;
    let isModuleAdmin = false;
    let isFinanceAdmin = false;
    
    for (const department of userDepartments) {
      for (const role of department.roles) {
        // Check for super admin role
        if (role.code === ROLECODES.SUPERADMIN) {
          isSuperAdmin = true;
        }

        // Check roles specific to VENDORCONTRACT module
        if (moduleCode === ModuleCode.VENDORCONTRACT) {
          if (role.code === ROLECODES.FINANCEADMIN) {
            isFinanceAdmin = true;
          }
          if (role.code === ROLECODES.VENDORMODULEADMIN) {
            isModuleAdmin = true;
          }
        }

        // Check roles specific to HEADCOUNTREQUEST module
        if (moduleCode === ModuleCode.HEADCOUNTREQUEST) {
          if (role.code === ROLECODES.HEADCOUNTMODULEADMIN) {
            isModuleAdmin = true;
          }
        }
      }
    }

    return { isSuperAdmin, isModuleAdmin, isFinanceAdmin };
  }

  // Userprofile API frame the format roles
  formatRoles(roles: Role[]): Role[] {
    return roles.map((role) => ({
      _id: role._id,
      name: role.name,
      code: role.code,
      status: role.status,
    }));
  }

  // Process permissions and map them to modules in userProfile
  processRolePermissions(
    permissions: Permission[],
    modulesMap: Map<string, Module> = new Map(),
  ): Map<string, Module> {
    permissions.forEach((permission) => {
      if (permission.moduleStatus) {
        const moduleIdStr = permission.moduleId.toString();

        // Check if the module is already in the map
        if (!modulesMap.has(moduleIdStr)) {
          modulesMap.set(moduleIdStr, {
            _id: permission.moduleId,
            name: permission.moduleName,
            code: permission.moduleCode,
            status: permission.moduleStatus,
            permissions: [permission.permissionCode], // Initialize permissions array
          });
        } else {
          const module = modulesMap.get(moduleIdStr); // Get the module
          if (module) {
            // Ensure module exists before using it
            if (!module.permissions.includes(permission.permissionCode)) {
              module.permissions.push(permission.permissionCode); // Add permission if it's not already there
            }
          }
        }
      }
    });

    return modulesMap;
  }

  sortModules(modules: Module[]): Module[] {
    return modules.sort((a, b) => {
      if (a.name === "Settings") return 1; // Move "Settings" to the end
      if (b.name === "Settings") return -1;
      return 0; // Maintain original order for other modules
    });
  }

  // FilterMeta API helper service
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public async fetchRolesAndDepartments(moduleId: string): Promise<any> {
    const queryCriteria = {
      code: {
        $nin: [
          ROLECODES.GUESTUSER,
          ROLECODES.SUPERADMIN,
          ROLECODES.VENDORMODULEADMIN,
          ROLECODES.HEADCOUNTMODULEADMIN,
        ],
      },
      moduleId: { $in: moduleId },
      status: true,
    };

    const departmentQueryCriteria = {
      code: { $ne: DEPARTMENTCODES.CHIEF },
      status: true,
    };

    const options = {
      select: "name _id",
      sort: { _id: 1 },
    };

    return Promise.all([
      this.rolesRepo.find(queryCriteria, options),
      this.departmentsRepository.find(departmentQueryCriteria, options),
    ]);
  }

  // Helper method to extract roles and departments from userDetails
  public extractUserRolesAndDepartments(departments: Department[]): {
    userDepartments: { _id: Types.ObjectId; name: string }[];
    userRoles: { _id: Types.ObjectId; name: string }[];
  } {
    const userDepartments: { _id: Types.ObjectId; name: string }[] = [];
    const userRoles: { _id: Types.ObjectId; name: string }[] = [];

    for (const department of departments) {
      userDepartments.push({
        _id: department._id,
        name: department.name,
      });

      for (const role of department.roles) {
        userRoles.push({
          _id: role._id,
          name: role.name,
        });
      }
    }

    return { userDepartments, userRoles };
  }

  public async getNextApprovers(
    department: { departmentName: string; department: Types.ObjectId },
    nextWorkflow: {
      roleId: ObjectId;
      roleName?: string;
      isSpecificDeptApprover?: boolean;
    },
    moduleId: string,
    code: string,
    service: string,
  ): Promise<string[]> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const queryCriteria: any = { status: true };

    this.logger.log(
      `Form ${service} NextWorkflow: ${department.department}-${department.departmentName}- ${nextWorkflow.roleId}-${nextWorkflow.roleName}- isSpecificDeptApprover Flag- ${nextWorkflow.isSpecificDeptApprover}`,
    );

    if (nextWorkflow.isSpecificDeptApprover) {
      // Specific department approver logic
      const key = "departments";
      queryCriteria[key] = {
        $elemMatch: {
          _id: department.department,
          roles: {
            $elemMatch: {
              _id: nextWorkflow.roleId,
              moduleId: moduleId,
              status: true,
            },
          },
        },
      };
    } else {
      // Non-specific department approver logic
      queryCriteria["departments.roles"] = {
        $elemMatch: {
          _id: nextWorkflow.roleId,
          moduleId: moduleId,
          status: true,
        },
      };
    }
    this.logger.log(
      ` ${service}-NextUserQuery: ${JSON.stringify(queryCriteria)}`,
    );
    const projectionUser = "email -_id";
    const userWithEmails = await this.usersRepo.find(
      queryCriteria,
      projectionUser,
    );
    const userEmails = userWithEmails.map(
      (user: { email: string }) => user.email,
    );

    this.logger.log(`${service}-User Emails: ${JSON.stringify(userEmails)}`);

    // Throw error if no matching users found
    if (userWithEmails.length === 0) {
      throw new NotFoundException(
        `No users found for form code: ${code}, workflow: ${nextWorkflow.roleName}, or department: ${department.departmentName}. Unable to proceed to the next level. Please contact the admin for assistance.`,
      );
    }

    return userEmails;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public async UpdateRolesInUsers(id: string, exisitngData: any) {
    const usersWithRole = await this.usersRepo.find({
      "departments.roles._id": id,
    });

    if (!usersWithRole || usersWithRole.length === 0) {
      return [];
    }

    if (usersWithRole.length > 0) {
      // Step 3: Update the role information in the users collection
      await Promise.all(
        usersWithRole.map(async (user) => {
          const updatedDepartments = user.departments.map((department) => {
            // Update roles within this department
            const updatedRoles = department.roles.map((role) =>
              role._id.toString() === id
                ? { ...role, ...exisitngData } // Merge updated role data
                : role,
            );

            return {
              ...department,
              roles: updatedRoles,
            };
          });

          // Update the user's departments in the database
          await this.usersRepo.findOneAndUpdate(
            { _id: user._id },
            { $set: { departments: updatedDepartments } },
          );
        }),
      );
    }
    return {
      message: "Users associated with this role is updated.",
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public async UpdateRolesInOtherCollection(requestData: any[]) {
    const messages: string[] = [];

    await Promise.all(
      requestData.map(async (existingData) => {
        const id = existingData._id; // Extract the id from existingData._id
        if (!id) {
          throw new BadRequestException(
            "ID is missing in one of the data objects.",
          );
        }
        // Step 2: Find users associated with this role
        const usersWithRole = await this.usersRepo.find({
          "departments.roles._id": id,
        });
        if (!usersWithRole || usersWithRole.length === 0) {
          messages.push(
            `Role with ID ${id} updated, but no users are associated with this role.`,
          );
          return;
        }

        // Step 3: Update the role information in the users collection
        await Promise.all(
          usersWithRole.map(async (user) => {
            const updatedDepartments = user.departments.map((department) => {
              // Update roles within this department
              const updatedRoles = department.roles.map((role) =>
                role._id.toString() === id
                  ? { ...role, ...existingData } // Merge updated role data
                  : role,
              );

              return {
                ...department,
                roles: updatedRoles,
              };
            });

            // Step 4: Update the user's departments in the database
            await this.usersRepo.findOneAndUpdate(
              { _id: user._id },
              { $set: { departments: updatedDepartments } },
            );
          }),
        );
        messages.push(`Users associated with role ID ${id} have been updated.`);
      }),
    );

    return {
      message: messages.join(" "),
    };
  }

  public async UpdatePermissionInRoles(
    permissionId: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    updatedPermissionData: any,
  ): Promise<string[]> {
    // Validate the permissionId
    if (!permissionId) {
      throw new BadRequestException("Permission ID is required.");
    }

    // Find roles where the permission exists
    const rolesWithPermission = await this.rolesRepo.find({
      "permissions._id": permissionId,
    });

    if (!rolesWithPermission.length) {
      return [];
    }

    // Update the roles
    const updatedRoleIds: string[] = [];
    await Promise.all(
      rolesWithPermission.map(async (role) => {
        // Find the permission index in the role's permissions array
        const permissionIndex = role.permissions.findIndex(
          (perm) => perm._id.toString() === permissionId,
        );

        if (permissionIndex === -1) {
          throw new NotFoundException(`Permission not found in the role.`);
        }

        // Replace the permission at the found index
        const updatedPermissions = [...role.permissions];
        updatedPermissions[permissionIndex] = {
          ...updatedPermissions[permissionIndex], // Keep the original permission properties
          ...updatedPermissionData, // Apply updated permission data
        };

        // Update the role with the modified permissions array
        const result = await this.rolesRepo.findOneAndUpdate(
          { _id: role._id },
          { $set: { permissions: updatedPermissions } },
        );

        if (result) {
          updatedRoleIds.push(role._id.toString());
        }
      }),
    );

    return updatedRoleIds;
  }

  public async UpdateRoleInWorkFlow(roleId: string, updatedName: string) {
    const objectIdRoleId = new Types.ObjectId(roleId);
    if (!roleId || !updatedName) {
      throw new NotFoundException("Role ID and updated name are required.");
    }

    const workflows = await this.workFlowRepo.find({
      "workflowOrder.role": objectIdRoleId,
    });

    if (workflows.length === 0) {
      return [];
    } else {
      await Promise.all(
        workflows.map(async (workflow) => {
          const updatedWorkflowOrder = workflow.workflowOrder.map((order) =>
            order.role.toString() === roleId
              ? { ...order, name: updatedName }
              : order,
          );

          await this.workFlowRepo.findOneAndUpdate(
            { _id: workflow._id }, // Find by workflow ID
            { $set: { workflowOrder: updatedWorkflowOrder } }, // Update only workflowOrder
          );
        }),
      );

      return { message: "Role name updated successfully in workflows." };
    }
  }

  public async UpdateModuleInPermissions(
    moduleId: string,
    moduleName: string,
    moduleStatus: boolean,
  ) {
    if (!moduleId || !moduleName) {
      throw new Error("Module ID and module name are required.");
    }

    // Convert moduleId to ObjectId
    const objectIdModuleId = new Types.ObjectId(moduleId);

    // Find all permissions that match the moduleId
    const permissions = await this.permissionsRepo.find({
      moduleId: objectIdModuleId,
    });

    if (!permissions || permissions.length === 0) {
      return [];
    } else {
      // Iterate over each matching document and update them one by one
      await Promise.all(
        permissions.map(async (permission) => {
          await this.permissionsRepo.findOneAndUpdate(
            { _id: permission._id }, // Find by _id
            { $set: { moduleName, moduleStatus } }, // Update fields
          );
        }),
      );

      return {
        message: "Permissions updated successfully.",
        updatedCount: permissions.length,
      };
    }
  }

  public async UpdateModuleInRoles(
    moduleId: string,
    moduleName: string,
    moduleStatus: boolean,
  ) {
    if (!moduleId || !moduleName || moduleStatus === undefined) {
      throw new BadRequestException(
        "Module ID, name, and status are required.",
      );
    }
    // Convert moduleId to ObjectId
    const objectIdModuleId = new Types.ObjectId(moduleId);

    // Find roles that contain permissions with the given moduleId
    const roles = await this.rolesRepo.find({
      "permissions.moduleId": objectIdModuleId,
    });

    if (roles.length === 0) {
      return [];
    } else {
      await Promise.all(
        roles.map(async (role) => {
          // Update permissions array inside the role
          const updatedPermissions = role.permissions.map((permission) =>
            permission.moduleId.toString() === moduleId
              ? { ...permission, moduleName, moduleStatus }
              : permission,
          );

          // Update the role document with modified permissions array
          await this.rolesRepo.findOneAndUpdate(
            { _id: role._id }, // Find the role by ID
            { $set: { permissions: updatedPermissions } }, // Update only the permissions array
          );
        }),
      );

      return {
        message: "Permissions updated successfully for matching roles.",
      };
    }
  }

  public async UpdateModuleInUsers(
    moduleId: string,
    moduleName: string,
    moduleStatus: boolean,
  ) {
    if (!moduleId || !moduleName || moduleStatus === undefined) {
      throw new BadRequestException(
        "Module ID, name, and status are required.",
      );
    }

    // Find users that contain the moduleId in their permissions
    const users = await this.usersRepo.find({
      "departments.roles.permissions.moduleId": moduleId,
    });

    if (users.length === 0) {
      return [];
    } else {
      await Promise.all(
        users.map(async (user) => {
          // Update departments array
          const updatedDepartments = user.departments.map((department) => {
            const updatedRoles = department.roles.map((role) => {
              // Update permissions array inside each role
              const updatedPermissions = role.permissions.map((permission) =>
                permission.moduleId.toString() === moduleId
                  ? { ...permission, moduleName, moduleStatus } // Update only moduleName & moduleStatus
                  : permission,
              );

              return {
                ...role,
                permissions: updatedPermissions,
              };
            });

            return {
              ...department,
              roles: updatedRoles,
            };
          });

          // Update the user document with modified departments array
          await this.usersRepo.findOneAndUpdate(
            { _id: user._id }, // Find user by ID
            { $set: { departments: updatedDepartments } }, // Update only departments array
          );
        }),
      );

      return {
        message:
          "Module name and status updated successfully in user permissions.",
      };
    }
  }

  public async CheckRoleInWorkflow(roleId: string): Promise<boolean> {
    // Validate input
    if (!roleId) {
      throw new BadRequestException("Role ID is required.");
    }
    try {
      const objectIdRoleId = new Types.ObjectId(roleId);
      const workflow = await this.workFlowRepo.findOne({
        "workflowOrder.role": objectIdRoleId,
      });
      // biome-ignore lint/complexity/noUselessTernary: <explanation>
      return workflow ? false : true;
    } catch (error) {
      return true;
    }
  }

  public async RemoveRoleFromUser(roleId: string) {
    if (!roleId) {
      throw new BadRequestException("Role ID is required.");
    }

    const objectIdRoleId = new Types.ObjectId(roleId);

    // Find users who have this role in their departments
    const usersWithRole = await this.usersRepo.find({
      "departments.roles._id": objectIdRoleId,
    });

    // If no users have this role, return false immediately
    if (usersWithRole.length === 0) {
      return false;
    } else {
      // Iterate over each user and remove the role
      await Promise.all(
        usersWithRole.map(async (user) => {
          const updatedDepartments = user.departments.map((department) => ({
            ...department,
            roles: department.roles.filter(
              (role) => !role._id.equals(objectIdRoleId),
            ),
          }));

          await this.usersRepo.findOneAndUpdate(
            { _id: user._id },
            { $set: { departments: updatedDepartments } },
          );
        }),
      );

      return true; // Role successfully removed
    }
  }

  public async RemoveDepartmentFromUser(departmentId: string) {
    if (!departmentId) {
      throw new BadRequestException("Department ID is required.");
    }

    const objectIdDepartmentId = new Types.ObjectId(departmentId);

    // Find users who have this department
    const usersWithDepartment = await this.usersRepo.find({
      "departments._id": objectIdDepartmentId,
    });

    // If no users have this department, return false immediately
    if (usersWithDepartment.length === 0) {
      return false;
    } else {
      // Iterate over each user and remove the department
      await Promise.all(
        usersWithDepartment.map(async (user) => {
          const updatedDepartments = user.departments.filter(
            (department) => !department._id.equals(objectIdDepartmentId),
          );

          await this.usersRepo.findOneAndUpdate(
            { _id: user._id },
            { $set: { departments: updatedDepartments } },
          );
        }),
      );

      return true; // Department successfully removed
    }
  }

  public async RemovePermissionFromRole(permissionId: string) {
    if (!permissionId) {
      throw new BadRequestException("Permission ID is required.");
    }

    const objectIdPermissionId = new Types.ObjectId(permissionId);

    // Find roles that contain this permission in their permissions array
    const rolesWithPermission = await this.rolesRepo.find({
      "permissions._id": objectIdPermissionId,
    });

    // If no roles have this permission, return false immediately
    if (rolesWithPermission.length === 0) {
      return false;
    } else {
      // Iterate over each role and remove the permission
      await Promise.all(
        rolesWithPermission.map(async (role) => {
          const updatedPermissions = role.permissions.filter(
            (permission) => !permission._id.equals(objectIdPermissionId),
          );

          await this.rolesRepo.findOneAndUpdate(
            { _id: role._id },
            { $set: { permissions: updatedPermissions } },
          );
        }),
      );

      return true; // Permission successfully removed
    }
  }

  public async RemovePermissionFromRoleByModuleId(
    moduleId: string,
    updatedEmail: string,
  ) {
    if (!moduleId) {
      throw new BadRequestException("Module ID is required.");
    }
    const objectIdModuleId = new Types.ObjectId(moduleId);

    try {
      // Find roles that contain permissions with the given moduleId
      const rolesWithPermissions = await this.rolesRepo.find({
        "permissions.moduleId": objectIdModuleId,
      });

      // If no roles have matching permissions, return false
      if (rolesWithPermissions.length === 0) {
        return false;
      }

      await Promise.all(
        rolesWithPermissions.map(async (role) => {
          const updatedPermissions = role.permissions.map((permission) => {
            if (permission.moduleId.equals(objectIdModuleId)) {
              return {
                ...permission,
                moduleStatus: false,
                updatedBy: updatedEmail,
              };
            }
            return permission;
          });

          await this.rolesRepo.findOneAndUpdate(
            { _id: role._id },
            { $set: { permissions: updatedPermissions } },
          );
        }),
      );

      return true; // Permissions successfully removed
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while removing permissions.",
      );
    }
  }

  public async RemovePermissionFromUserDepartments(permissionId: string) {
    if (!permissionId) {
      throw new BadRequestException("Permission ID is required.");
    }

    const objectIdPermissionId = new Types.ObjectId(permissionId);

    // Find users who have this permission inside departments -> roles -> permissions
    const usersWithPermission = await this.usersRepo.find({
      "departments.roles.permissions._id": objectIdPermissionId,
    });

    // If no users have this permission, return false immediately
    if (usersWithPermission.length === 0) {
      return false;
    } else {
      // Iterate over each user and remove the permission
      await Promise.all(
        usersWithPermission.map(async (user) => {
          const updatedDepartments = user.departments.map((department) => ({
            ...department,
            roles: department.roles.map((role) => ({
              ...role,
              permissions: role.permissions.filter(
                (permission) => !permission._id.equals(objectIdPermissionId),
              ),
            })),
          }));

          await this.usersRepo.findOneAndUpdate(
            { _id: user._id },
            { $set: { departments: updatedDepartments } },
          );
        }),
      );

      return true; // Permission successfully removed
    }
  }

  public async RemovePermissionFromUserDepartmentsByModuleId(
    moduleId: string,
    updatedUserEmail: string,
  ) {
    if (!moduleId) {
      throw new BadRequestException("Module ID is required.");
    }

    const objectIdModuleId = new Types.ObjectId(moduleId);

    try {
      // Find users that contain roles with permissions matching the moduleId
      const usersWithPermissions = await this.usersRepo.find({
        "departments.roles.permissions.moduleId": objectIdModuleId,
      });

      // If no users have matching permissions, return false
      if (usersWithPermissions.length === 0) {
        return false;
      }

      // Iterate over each user and update their roles' permissions

      await Promise.all(
        usersWithPermissions.map(async (user) => {
          const updatedDepartments = user.departments.map((department) => ({
            ...department,
            roles: department.roles.map((role) => ({
              ...role,
              permissions: role.permissions.map((permission) => {
                if (permission.moduleId.equals(objectIdModuleId)) {
                  return {
                    ...permission,
                    moduleStatus: false,
                    updatedBy: updatedUserEmail,
                  };
                }
                return permission;
              }),
            })),
          }));

          await this.usersRepo.findOneAndUpdate(
            { _id: user._id },
            { $set: { departments: updatedDepartments } },
          );
        }),
      );

      return true; // Permissions successfully removed
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while removing permissions.",
      );
    }
  }

  public async InActivateModuleStatusInPermissions(
    moduleId: string,
    updatedEmail: string,
  ) {
    if (!moduleId) {
      throw new BadRequestException("Module ID is required.");
    }

    try {
      const objectIdModuleId = new Types.ObjectId(moduleId);

      // Step 1: Retrieve all permissions with the given moduleId
      const permissions = await this.permissionsRepo.find({
        moduleId: objectIdModuleId,
      });

      // Step 2: If no permissions found, return immediately
      if (!permissions || permissions.length === 0) {
        return;
      }

      // Step 3: Update each permission
      await Promise.all(
        permissions.map(async (permission) => {
          await this.permissionsRepo.findOneAndUpdate(
            { _id: permission._id },
            { $set: { moduleStatus: false, updatedBy: updatedEmail } },
            { new: true },
          );
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while updating module status.",
      );
    }
  }

  // Common function to fetch setting-related menus for which the user has permission for that module. For example, the user permissions include add, list, detail, and edit, with a common permission name 'view-user-settings'
  public async settingsPermissionCheck(
    emailId: string,
    moduleId: string,
    type: string,
  ): Promise<boolean> {
    const options = { select: "code -_id" };
    const formModuleCode = await this.formModuleRepository.findById(
      moduleId,
      options,
    );
    if (!formModuleCode) {
      throw new NotFoundException(`Module #${moduleId} not found`);
    }
    const { code: moduleCode } = formModuleCode;
    if (moduleCode !== ModuleCode.SETTINGS) {
      throw new NotFoundException(`Invalid Module`);
    }
    const userDetails = await this.usersRepo.findOneExisting({
      email: emailId,
      status: true,
    });
    const departments = userDetails?.departments || [];
    this.logger.log(
      `Users List- ${userDetails ? userDetails.departments.length : "Departments details not found"}`,
    );
    if (!departments || departments.length === 0) {
      throw new ForbiddenException(`Invalid permission  for user: ${emailId}`);
    }
    const permissionCheck = await this.validatePermission(
      moduleCode,
      type,
      moduleId,
      departments,
    );

    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCheck}`,
    );
    if (!permissionCheck) {
      throw new ForbiddenException(
        `The permission code provided is invalid for module: ${moduleCode}.`,
      );
    }
    return true;
  }

  public async UpdateDepartmentInUsers(
    departmentId: string,
    departmentName: string,
    departmentCode: string,
  ) {
    if (!departmentId || !departmentName) {
      throw new BadRequestException("Department ID and name are required.");
    }

    // Step 1: Find users that contain the departmentId in their departments array
    const users = await this.usersRepo.find({
      "departments._id": departmentId,
    });

    if (users.length === 0) {
      return [];
    } else {
      await Promise.all(
        users.map(async (user) => {
          // Step 2: Update the department name inside the departments array
          const updatedDepartments = user.departments.map((department) =>
            department._id.toString() === departmentId
              ? { ...department, name: departmentName, code: departmentCode } // Update department name
              : department,
          );

          // Step 3: Update the user document with modified departments array
          await this.usersRepo.findOneAndUpdate(
            { _id: user._id }, // Find user by ID
            { $set: { departments: updatedDepartments } }, // Update only departments array
          );
        }),
      );

      return {
        message: "Department name updated successfully in user documents.",
      };
    }
  }

  public async RemoveModuleFromRole(moduleId: string) {
    if (!moduleId) {
      throw new BadRequestException("Module ID is required.");
    }

    // Step 1: Find roles that contain the moduleId in the moduleId array
    const roles = await this.rolesRepo.find({
      moduleId: moduleId,
    });

    if (roles.length === 0) {
      return { message: "No roles found with the given module ID." };
    }

    // Step 2: Iterate over roles and remove the moduleId from the moduleId array
    await Promise.all(
      roles.map(async (role) => {
        const updatedModuleIds = role.moduleId.filter(
          (id) => id.toString() !== moduleId,
        );

        // Step 3: Update the role document with modified moduleId array
        await this.rolesRepo.findOneAndUpdate(
          { _id: role._id }, // Find role by ID
          { $set: { moduleId: updatedModuleIds } }, // Update moduleId array
        );
      }),
    );

    return {
      message: "Module ID removed successfully from roles.",
    };
  }

  public async RemoveModuleFromUserRoles(moduleId: string) {
    if (!moduleId) {
      throw new BadRequestException("Module ID is required.");
    }

    // Step 1: Find users whose roles contain the given moduleId
    const users = await this.usersRepo.find({
      "departments.roles.moduleId": moduleId,
    });

    if (users.length === 0) {
      return { message: "No users found with the given module ID in roles." };
    }

    // Step 2: Iterate over users and update roles by removing the moduleId
    await Promise.all(
      users.map(async (user) => {
        const updatedDepartments = user.departments.map((department) => {
          const updatedRoles = department.roles.map((role) => {
            const updatedModuleIds = role.moduleId.filter(
              (id) => id.toString() !== moduleId,
            );

            return {
              ...role,
              moduleId: updatedModuleIds, // Update moduleId array
            };
          });

          return {
            ...department,
            roles: updatedRoles,
          };
        });

        // Step 3: Update the user document with the modified departments array
        await this.usersRepo.findOneAndUpdate(
          { _id: user._id }, // Find user by ID
          { $set: { departments: updatedDepartments } }, // Update departments array
        );
      }),
    );

    return {
      message:
        "Module ID removed successfully from roles inside user documents.",
    };
  }

  async getSpecificUserDetails(userId: string) {
    if (userId === NotRequiredGM.name) {
      return {
        userId: NotRequiredGM.name,
        name: NotRequiredGM.name,
        email: NotRequiredGM.name,
      };
    }
    const user = await this.usersRepo.findOne({ _id: userId });
    if (!user) throw new Error("User not found");
    const { name, email, _id, departments } = user;

    // Find the role with the code "general-manager"
    const role = departments
      ?.flatMap((dept) => dept.roles || []) // Flatten all roles into a single array
      .find((role) => role.code === ROLECODES.GENERALMANAGER);

    // Return user details only if the role exists, otherwise return an empty object
    if (!role) {
      return {}; // Ensure empty object is returned
    }
    return {
      userId: _id.toString(),
      name,
      email,
      roleName: role.name,
      roleId: role._id || "", // Ensure valid conversion
      roleCode: role.code,
    };
  }
}
