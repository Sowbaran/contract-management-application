import { Db, MongoClient, ObjectId } from 'mongodb';

const usersData = [
  {
    name: "Mohan Murugesan",
    email: "mmurugesan@nrl.com.au",
    departments: [
      {
        _id: new ObjectId("6773bf1fccffb83c5ccf5db0"),
        name: "Chief Departments",
        code: "chief-department",
        roles: [
          {
            _id: new ObjectId("65def325de3deddff04f79a0"),
            name: "Super Admin",
            code: "super-admin",
            description: "Super Admin",
            status: true,
            moduleId: [
              new ObjectId("65e3579de0ca70fe8f2e148e"),
              new ObjectId("65def137de3deddff04f799b"),
            ],
            permissions: [
              {
                _id: new ObjectId("676d55a1ccffb83c5ccf5da4"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-team-requests-tab",
                permissionName: "View Team Requests Tab",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to enable Team Requests Tab",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d3997ccffb83c5ccf5d9b"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-forms-menu",
                permissionName: "View Forms Menu",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to Forms Menu page",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d393accffb83c5ccf5d9a"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-dashboard-menu",
                permissionName: "View Dashboard Menu",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to Dashboard page",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d39f8ccffb83c5ccf5d9c"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-configuration",
                permissionName: "View Configuration",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to Configuration page",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d563eccffb83c5ccf5da5"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-my-requests-tab",
                permissionName: "View My Requests Tab",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to enable My Requests Tab",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d3e3cccffb83c5ccf5da2"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-approve-request-tab",
                permissionName: "View Approve Requests Tab",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to enable Approve Requests Tab",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
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
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
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
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d57b6ccffb83c5ccf5da7"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-settings",
                permissionName: "View Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5c65ccffb83c5ccf5daa"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-role-settings",
                permissionName: "View Role Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to role settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5cdfccffb83c5ccf5dab"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-permission-settings",
                permissionName: "View Permission Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to permission settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5d45ccffb83c5ccf5dac"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-module-settings",
                permissionName: "View Module Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to module settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d58e9ccffb83c5ccf5da8"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-user-settings",
                permissionName: "View User Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to user settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5b7cccffb83c5ccf5da9"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-department-settings",
                permissionName: "View Department Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to department settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              }
            ]
          }
        ]
      }
    ],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "mmurugesan@nrl.com.au",
    createdAt: new Date("2024-12-19T10:00:00.000Z"),
    updatedAt: new Date("2025-04-01T07:25:27.144Z"),
  },
  {
    name: "Balakumaran Bharathivel",
    email: "bbharathivel@nrl.com.au",
    departments: [
      {
        _id: new ObjectId("6773bf1fccffb83c5ccf5db0"),
        name: "Chief Departments",
        code: "chief-department",
        roles: [
          {
            _id: new ObjectId("65def325de3deddff04f79a0"),
            name: "Super Admin",
            code: "super-admin",
            description: "Super Admin",
            status: true,
            moduleId: [
              new ObjectId("65e3579de0ca70fe8f2e148e"),
              new ObjectId("65def137de3deddff04f799b"),
            ],
            permissions: [
              {
                _id: new ObjectId("676d55a1ccffb83c5ccf5da4"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-team-requests-tab",
                permissionName: "View Team Requests Tab",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to enable Team Requests Tab",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d3997ccffb83c5ccf5d9b"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-forms-menu",
                permissionName: "View Forms Menu",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to Forms Menu page",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d393accffb83c5ccf5d9a"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-dashboard-menu",
                permissionName: "View Dashboard Menu",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to Dashboard page",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d39f8ccffb83c5ccf5d9c"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-configuration",
                permissionName: "View Configuration",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to Configuration page",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d563eccffb83c5ccf5da5"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-my-requests-tab",
                permissionName: "View My Requests Tab",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to enable My Requests Tab",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d3e3cccffb83c5ccf5da2"),
                moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
                permissionCode: "view-approve-request-tab",
                permissionName: "View Approve Requests Tab",
                moduleCode: "contract",
                moduleName: "Contract Approval",
                moduleStatus: true,
                description: "Allows access to enable Approve Requests Tab",
                status: true,
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
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
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
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
                updatedBy: "vrameshbapu@nrl.com.au",
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d57b6ccffb83c5ccf5da7"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-settings",
                permissionName: "View Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5c65ccffb83c5ccf5daa"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-role-settings",
                permissionName: "View Role Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to role settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5cdfccffb83c5ccf5dab"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-permission-settings",
                permissionName: "View Permission Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to permission settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5d45ccffb83c5ccf5dac"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-module-settings",
                permissionName: "View Module Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to module settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d58e9ccffb83c5ccf5da8"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-user-settings",
                permissionName: "View User Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to user settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              },
              {
                _id: new ObjectId("676d5b7cccffb83c5ccf5da9"),
                moduleId: new ObjectId("65def137de3deddff04f799b"),
                permissionCode: "view-department-settings",
                permissionName: "View Department Settings",
                moduleCode: "settings",
                moduleName: "Settings",
                moduleStatus: true,
                description: "Allows access to department settings page",
                status: true,
                createdAt: new Date("2025-04-10T08:11:33.997Z"),
                updatedAt: new Date("2025-04-10T08:11:33.997Z")
              }
            ]
          }
        ]
      }
    ],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date("2024-02-28T11:06:18.974Z"),
    updatedAt: new Date("2025-03-25T10:43:21.541Z"),
  },
];


// Migration function to transform users collection
export async function up(db: Db): Promise<void> {
  console.log("Starting users migration");
  try {
    // Count documents in users collection before migration
    const countBefore = await db.collection("users").countDocuments();
    console.log(`Documents in users before archiving: ${countBefore}`);

    // Fetch all existing users
    const existingUsers = await db.collection("users").find({}).toArray();

    // Archive existing users to archived_users collection
    if (existingUsers.length > 0) {
      const archivedUsers = existingUsers.map((user) => ({
        ...user,
        archivedAt: new Date(),
        source: "users_migration",
      }));
      const archiveResult = await db
        .collection("archived_users")
        .insertMany(archivedUsers);
      console.log(
        `Archived ${archiveResult.insertedCount} documents to archived_users`,
      );
    } else {
      console.log("No users to archive");
    }

    // Define special department mappings for Finance, Insurance, and Legal
    const specialDeptMappings: Record<
      string,
      { _id: ObjectId; code: string; name: string }
    > = {
      "65e3923a6d98432f2ac48ac1": {
        // Insurance
        _id: new ObjectId("672acbdd06b004004c729c99"),
        code: "finance-&-investments",
        name: "Finance & Investments",
      },
      "65e391c36d98432f2ac48abd": {
        // Finance
        _id: new ObjectId("672acbdd06b004004c729c99"),
        code: "finance-&-investments",
        name: "Finance & Investments",
      },
      "65e6be6d1bc6174e00ce7140": {
        // Legal
        _id: new ObjectId("65e391006d98432f2ac48ab8"),
        code: "risk,-legal-and-integrity",
        name: "Risk, Legal and Integrity",
      },
    };

    // Define chief department IDs
    const chiefDeptIds: ObjectId[] = [
      new ObjectId("65e6c3c71bc6174e00ce714a"),
      new ObjectId("65e6c4541bc6174e00ce714c"),
      new ObjectId("65e390bb6d98432f2ac48ab4"),
    ];

    // Fetch chief department by code
    const chiefDept = await db
      .collection("departments")
      .findOne({ code: "chief-department" });
    if (!chiefDept) {
      console.warn("Warning: No department found with code 'chief-department'");
    } else {
      console.log(
        `Found chief department: ${chiefDept._id}: ${chiefDept.name}`,
      );
    }

    // Define chief department role IDs
    const chiefRoleIds: ObjectId[] = [
      new ObjectId("65def54ade3deddff04f79ad"), // CFO
      new ObjectId("65def561de3deddff04f79ae"), // CEO
      new ObjectId("65def330de3deddff04f79a1"), // Admin
      new ObjectId("65def325de3deddff04f79a0"), // Super Admin
    ];

    // Array to store transformed users
    const transformedUsers: any[] = [];
    const userIds = new Set<string>();

    // Process each user
    for (const user of existingUsers) {
      // Check for duplicate user IDs
      if (userIds.has(user._id.toString())) {
        console.warn(`Duplicate user ID detected: ${user._id}`);
        continue;
      }
      userIds.add(user._id.toString());

      // Convert department IDs to ObjectId
      const deptIds: ObjectId[] = user.department.map((id: string) =>
        new ObjectId(id),
      );

      // Collect unique department IDs to fetch, accounting for special mappings
      const deptIdsToFetch = new Set<string>();
      deptIds.forEach((deptId: ObjectId) => {
        const deptIdStr = deptId.toString();
        if (specialDeptMappings[deptIdStr]) {
          // Add mapped department ID for special cases
          deptIdsToFetch.add(specialDeptMappings[deptIdStr]._id.toString());
        } else {
          // Add original department ID
          deptIdsToFetch.add(deptIdStr);
        }
      });

      // Fetch departments from the database
      const departments = await db
        .collection("departments")
        .find({
          _id: { $in: Array.from(deptIdsToFetch).map((id) => new ObjectId(id)) },
        })
        .toArray();

      // Create a map of department IDs to their details for quick lookup
      const deptMap = new Map<string, any>(
        departments.map((dept) => [dept._id.toString(), dept]),
      );

      // Construct transformed departments array, handling mappings and deduplication
      const transformedDepartments: any[] = [];
      const addedDeptIds = new Set<string>();

      deptIds.forEach((deptId: ObjectId) => {
        const deptIdStr = deptId.toString();
        let dept;

        if (specialDeptMappings[deptIdStr]) {
          // Handle special department mappings (Finance, Insurance, Legal)
          const mappedDept = specialDeptMappings[deptIdStr];
          const targetDeptIdStr = mappedDept._id.toString();
          if (!addedDeptIds.has(targetDeptIdStr)) {
            // Use fetched department if available, otherwise use mapped details
            dept = deptMap.get(targetDeptIdStr) || {
              _id: mappedDept._id,
              code: mappedDept.code,
              name: mappedDept.name,
            };
            transformedDepartments.push(dept);
            addedDeptIds.add(targetDeptIdStr);
          }
        } else {
          // Handle non-special departments
          const existingDept = deptMap.get(deptIdStr);
          if (existingDept && !addedDeptIds.has(deptIdStr)) {
            transformedDepartments.push(existingDept);
            addedDeptIds.add(deptIdStr);
          }
        }
      });

      // Fetch all user roles
      const roleIds: ObjectId[] = user.roles.map((id: string) =>
        new ObjectId(id),
      );
      const roles = await db
        .collection("roles")
        .find({
          _id: { $in: roleIds },
        })
        .toArray();
      console.log(
        `User ${user.email}: Fetched roles ${roles
          .map((r) => r.name)
          .join(", ")}`,
      );

      // Split roles into chief and non-chief
      const chiefRoles = roles.filter((role: any) =>
        chiefRoleIds.some((chiefId) => chiefId.equals(role._id)),
      );
      const nonChiefRoles = roles.filter((role: any) =>
        !chiefRoleIds.some((chiefId) => chiefId.equals(role._id)),
      );

      // Construct departments array for the user
      const departmentsArray: any[] = [];

      // Add chief department if user has any chief department IDs
      const hasChiefDept = deptIds.some((deptId: ObjectId) =>
        chiefDeptIds.some((chiefId) => chiefId.equals(deptId)),
      );
      if (hasChiefDept && chiefDept && chiefRoles.length > 0) {
        console.log(
          `User ${user.email}: Adding chief-department ${
            chiefDept.name
          } with roles ${chiefRoles.map((r: any) => r.name).join(", ")}`,
        );
        departmentsArray.push({
          _id: chiefDept._id,
          name: chiefDept.name,
          code: chiefDept.code,
          roles: chiefRoles.map((role: any) => ({
            _id: role._id,
            name: role.name,
            code: role.code,
            description: role.description,
            moduleId: role.moduleId || [],
            status: role.status,
            permissions: role.permissions || [],
            createdAt: role.createdAt || new Date(),
            updatedAt: role.updatedAt || new Date(),
          })),
        });
      } else if (hasChiefDept && chiefRoles.length === 0) {
        console.log(
          `User ${user.email}: No chief roles found for chief-department`,
        );
      }

      // Add other departments (excluding chief if already added)
      const nonChiefDepartments = chiefDept
        ? transformedDepartments.filter(
            (dept: any) => !dept._id.equals(chiefDept._id),
          )
        : transformedDepartments;
      nonChiefDepartments.forEach((dept: any) => {
        if (nonChiefRoles.length > 0) {
          console.log(
            `User ${user.email}: Adding department ${
              dept.name
            } with roles ${nonChiefRoles
              .map((r: any) => r.name)
              .join(", ")}`,
          );
          departmentsArray.push({
            _id: dept._id,
            name: dept.name,
            code: dept.code,
            roles: nonChiefRoles.map((role: any) => ({
              _id: role._id,
              name: role.name,
              code: role.code,
              description: role.description,
              moduleId: role.moduleId || [],
              status: role.status,
              permissions: role.permissions || [],
              createdAt: role.createdAt || new Date(),
              updatedAt: role.updatedAt || new Date(),
            })),
          });
        } else {
          console.log(
            `User ${user.email}: No non-chief roles for department ${dept.name}`,
          );
        }
      });

      // Construct transformed user
      transformedUsers.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        createdBy: "bbharathivel@nrl.com.au",
        createdAt: user.created_at || new Date(),
        updatedAt: user.updated_at || new Date(),
        updatedBy: "bbharathivel@nrl.com.au",
        __v: 0,
        departments: departmentsArray,
      });
    }

    // Verify no duplicates in transformed users
    const transformedUserIds = new Set(
      transformedUsers.map((user) => user._id.toString()),
    );
    if (transformedUserIds.size !== transformedUsers.length) {
      throw new Error(
        `Duplicate user IDs detected in transformed users: ${transformedUsers.length} users, ${transformedUserIds.size} unique IDs`,
      );
    }
    console.log(
      `Processed ${existingUsers.length} users, transformed ${transformedUsers.length} users`,
    );

    // Delete existing users
    const deleteResult = await db.collection("users").deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} documents from users`);

    // Insert transformed users
    if (transformedUsers.length > 0) {
      const insertResult = await db
        .collection("users")
        .insertMany(transformedUsers);
      console.log(
        `Inserted ${insertResult.insertedCount} documents into users`,
      );
    } else {
      console.log("No transformed users to insert");
    }

    // Process usersData: update existing users or insert new ones
    for (const userData of usersData) {
      const email = userData.email;
      console.log(`Processing user with email: ${email}`);

      // Check if user exists by email
      const existingUser = await db
        .collection("users")
        .findOne({ email });

      if (existingUser) {
        // Update existing user with all fields from userData
        const updateResult = await db.collection("users").updateOne(
          { email },
          { $set: userData },
        );
        console.log(
          `Updated user ${email}: matched ${updateResult.matchedCount}, modified ${updateResult.modifiedCount}`,
        );
      } else {
        // Insert new user
        const insertResult = await db.collection("users").insertOne(userData);
        console.log(
          `Inserted new user ${email}: ID ${insertResult.insertedId}`,
        );
      }
    }

    console.log("Users migration completed successfully");
  } catch (error) {
    console.error("Error in users migration:", error);
    throw error;
  }
}

// Rollback function to revert migration
export async function down(db: Db): Promise<void> {
  console.log("Starting users migration rollback");
  try {
    // Delete transformed users
    const deleteResult = await db.collection("users").deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} documents from users`);

    // Restore archived users
    const archivedUsers = await db
      .collection("archived_users")
      .find({
        source: "users_migration",
      })
      .toArray();
    if (archivedUsers.length > 0) {
      // Remove archive-specific fields
      const usersToRestore = archivedUsers.map(
        ({ archivedAt, source, ...user }) => user,
      );
      const restoreResult = await db
        .collection("users")
        .insertMany(usersToRestore);
      console.log(`Restored ${restoreResult.insertedCount} documents to users`);

      // Clean up archived_users
      await db.collection("archived_users").deleteMany({
        source: "users_migration",
      });
      console.log("Cleaned up archived_users collection");
    } else {
      console.log("No archived users to restore");
    }

    console.log("Users migration rolled back successfully");
  } catch (error) {
    console.error("Error in users rollback:", error);
    throw error;
  }
}