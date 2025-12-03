import { ObjectId, Db } from "mongodb";

const permissionsData = [
  
  {
    _id: new ObjectId("676d393accffb83c5ccf5d9a"),
    status: true,
    permissionCode: "view-dashboard-menu",
    permissionName: "View Dashboard Menu",
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    moduleCode: "contract",
    moduleName: "Contract Approval",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    moduleStatus: true,
    description: "Allows access to Dashboard page",
  },
  {
    _id: new ObjectId("676d3997ccffb83c5ccf5d9b"),
    status: true,
    permissionCode: "view-forms-menu",
    permissionName: "View Forms Menu",
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    moduleCode: "contract",
    moduleName: "Contract Approval",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    moduleStatus: true,
    description: "Allows access to Forms Menu page",
  },
  {
    _id: new ObjectId("676d39f8ccffb83c5ccf5d9c"),
    status: true,
    permissionCode: "view-configuration",
    permissionName: "View Configuration",
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    moduleCode: "contract",
    moduleName: "Contract Approval",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    moduleStatus: true,
    description: "Allows access to Configuration page",
  },
  {
    _id: new ObjectId("676d3e3cccffb83c5ccf5da2"),
    description: "Allows access to enable Approve Requests Tab",
    status: true,
    permissionCode: "view-approve-request-tab",
    permissionName: "View Approve Requests Tab",
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    moduleCode: "contract",
    moduleName: "Contract Approval",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d55a1ccffb83c5ccf5da4"),
    description: "Allows access to enable Team Requests Tab",
    status: true,
    permissionCode: "view-team-requests-tab",
    permissionName: "View Team Requests Tab",
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    moduleCode: "contract",
    moduleName: "Contract Approval",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d563eccffb83c5ccf5da5"),
    description: "Allows access to enable My Requests Tab",
    status: true,
    permissionCode: "view-my-requests-tab",
    permissionName: "View My Requests Tab",
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    moduleCode: "contract",
    moduleName: "Contract Approval",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d57b6ccffb83c5ccf5da7"),
    description: "Allows access to settings page",
    status: true,
    permissionCode: "view-settings",
    permissionName: "View Settings",
    moduleId: new ObjectId("65def137de3deddff04f799b"),
    moduleCode: "settings",
    moduleName: "Settings",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "mmurugesan@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2024-01-28T05:48:58.532Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d58e9ccffb83c5ccf5da8"),
    description: "Allows access to user settings page",
    status: true,
    permissionCode: "view-user-settings",
    permissionName: "View User Settings",
    moduleId: new ObjectId("65def137de3deddff04f799b"),
    moduleCode: "settings",
    moduleName: "Settings",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "mmurugesan@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2024-01-28T05:48:58.532Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d5b7cccffb83c5ccf5da9"),
    description: "Allows access to department settings page",
    status: true,
    permissionCode: "view-department-settings",
    permissionName: "View Department Settings",
    moduleId: new ObjectId("65def137de3deddff04f799b"),
    moduleCode: "settings",
    moduleName: "Settings",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "mmurugesan@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2024-01-28T05:48:58.532Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d5c65ccffb83c5ccf5daa"),
    description: "Allows access to role settings page",
    status: true,
    permissionCode: "view-role-settings",
    permissionName: "View Role Settings",
    moduleId: new ObjectId("65def137de3deddff04f799b"),
    moduleCode: "settings",
    moduleName: "Settings",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "mmurugesan@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2024-01-28T05:48:58.532Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d5cdfccffb83c5ccf5dab"),
    description: "Allows access to permission settings page",
    status: true,
    permissionCode: "view-permission-settings",
    permissionName: "View Permission Settings",
    moduleId: new ObjectId("65def137de3deddff04f799b"),
    moduleCode: "settings",
    moduleName: "Settings",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "mmurugesan@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2024-01-28T05:48:58.532Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("676d5d45ccffb83c5ccf5dac"),
    description: "Allows access to module settings page",
    status: true,
    permissionCode: "view-module-settings",
    permissionName: "View Module Settings",
    moduleId: new ObjectId("65def137de3deddff04f799b"),
    moduleCode: "settings",
    moduleName: "Settings",
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "mmurugesan@nrl.com.au",
    createdAt: new Date("2024-01-28T05:48:58.532Z"),
    updatedAt: new Date("2024-01-28T05:48:58.532Z"),
    moduleStatus: true,
  },
  {
    _id: new ObjectId("67e268a608b3f2bc83885e6c"),
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    permissionCode: "view-e-sign-requests-tab",
    permissionName: "View E Sign Requests Tab",
    moduleCode: "contract",
    moduleName: "Contract Approval",
    moduleStatus: true,
    description: "Allows access to enable E Sign Requests Tab",
    status: true,
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2025-03-25T08:26:14.055Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    __v: 0,
  },
  {
    _id: new ObjectId("67e2888bdbce9cd169ecadc8"),
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    permissionCode: "view-my-approved-requests-tab",
    permissionName: "View My Approved Requests Tab",
    moduleCode: "contract",
    moduleName: "Contract Approval",
    moduleStatus: true,
    description: "Allows access to enable My Approved Requests Tab",
    status: true,
    createdBy: "mmurugesan@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2025-03-25T10:42:19.161Z"),
    updatedAt: new Date("2025-04-10T08:11:33.493Z"),
    __v: 0,
  },
];

export async function up(db: Db) {
  console.log("Starting permissions migration");
  try {
    // Count documents before archiving
    const countBefore = await db.collection("permissions").countDocuments();
    console.log(`Documents in permissions before archiving: ${countBefore}`);

    // Archive existing permissions
    const existingPermissions = await db
      .collection("permissions")
      .find({})
      .toArray();
    if (existingPermissions.length > 0) {
      const archivedPermissions = existingPermissions.map((permission) => ({
        ...permission,
        archivedAt: new Date(),
        source: "permissions_migration",
      }));
      const archiveResult = await db
        .collection("archived_permissions")
        .insertMany(archivedPermissions);
      console.log(
        `Archived ${archiveResult.insertedCount} documents to archived_permissions`,
      );
    } else {
      console.log("No permissions to archive");
    }

    // Delete existing permissions
    const deleteResult = await db.collection("permissions").deleteMany({});
    console.log(
      `Deleted ${deleteResult.deletedCount} documents from permissions`,
    );

    // Insert new permissions
    const insertResult = await db
      .collection("permissions")
      .insertMany(permissionsData);
    console.log(
      `Inserted ${insertResult.insertedCount} documents into permissions`,
    );

    console.log("Permissions migration completed successfully");
  } catch (error) {
    console.error("Error in permissions migration:", error);
    throw error;
  }
}

export async function down(db: Db) {
  console.log("Starting permissions migration rollback");
  try {
    // Delete permissions added in up migration
    const deleteResult = await db.collection("permissions").deleteMany({
      _id: { $in: permissionsData.map((p) => p._id) },
    });
    console.log(
      `Deleted ${deleteResult.deletedCount} documents from permissions`,
    );

    // Restore archived permissions
    const archivedPermissions = await db
      .collection("archived_permissions")
      .find({
        source: "permissions_migration",
      })
      .toArray();
    if (archivedPermissions.length > 0) {
      // Remove archive-specific fields
      const permissionsToRestore = archivedPermissions.map(
        ({ archivedAt, source, ...permission }) => permission,
      );
      const restoreResult = await db
        .collection("permissions")
        .insertMany(permissionsToRestore);
      console.log(
        `Restored ${restoreResult.insertedCount} documents to permissions`,
      );

      // Clean up archived_permissions
      await db.collection("archived_permissions").deleteMany({
        source: "permissions_migration",
      });
      console.log("Cleaned up archived_permissions collection");
    } else {
      console.log("No archived permissions to restore");
    }

    console.log("Permissions migration rolled back successfully");
  } catch (error) {
    console.error("Error in permissions rollback:", error);
    throw error;
  }
}
