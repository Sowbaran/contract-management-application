import { ObjectId, Db } from "mongodb";

const departmentsData = [
  /*{
    _id: new ObjectId("65e3923a6d98432f2ac48ac1"),
    name: "Insurance",
    code: "insurance",
    description: "Insurance",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },*/
  {
    _id: new ObjectId("65fddbe60402961e255c5e57"),
    name: "Players",
    code: "players",
    description: "Players",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("65e767af49834fc6088bfba7"),
    name: "Elite Competitions",
    code: "elite_competitions",
    description: "Elite Competitions",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("667ce7c1801612b68daa88f0"),
    name: "Operations",
    code: "operations",
    description: "Operations",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("65fdd8c50402961e255c5e54"),
    name: "Clubs",
    code: "clubs",
    description: "Clubs",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("672ace97c305d10298e6e7d2"),
    name: "Corporate Affairs",
    code: "corporate-affairs",
    description: "Corporate Affairs",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("65e7696a49834fc6088bfbaa"),
    name: "States",
    code: "states",
    description: "States",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("65e766f549834fc6088bfba6"),
    name: "Participation",
    code: "participation",
    description: "Participation",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("65e7685b49834fc6088bfba9"),
    name: "Pathways",
    code: "pathways",
    description: "Pathways",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  /*{
    _id: new ObjectId("65e391c36d98432f2ac48abd"),
    name: "Finance",
    code: "finance",
    description: "Finance",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },*/
  {
    _id: new ObjectId("672acf6706b004004c729d08"),
    name: "Technology",
    code: "technology",
    description: "Technology - Department",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  /*{
    _id: new ObjectId("65e6be6d1bc6174e00ce7140"),
    name: "Legal",
    code: "legal",
    description: "Legal",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },*/
  {
    _id: new ObjectId("660bc1bb661119aeb801d27c"),
    name: "CEO & Strategy",
    code: "ceo-&-strategy",
    description: "CEO & Strategy",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("65e391006d98432f2ac48ab8"),
    name: "Risk, Legal and Integrity",
    code: "risk,-legal-and-integrity",
    description: "Risk, Legal and Integrity",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("667ce79d899ca2d07ccfc646"),
    name: "Commercial",
    code: "commercial",
    description: "Commercial",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("672acbdd06b004004c729c99"),
    name: "Finance & Investments",
    code: "finance-&-investments",
    description: "Finance & Investments",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
    ],
  },
  {
    _id: new ObjectId("6773bf1fccffb83c5ccf5db0"),
    name: "Chief Departments",
    code: "chief-department",
    description: "Chief Departments",
    roles: [],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    moduleId: [
      new ObjectId("65e3579de0ca70fe8f2e148e"),
      new ObjectId("65e357e0e0ca70fe8f2e1490"),
      new ObjectId("65def137de3deddff04f799b"),
    ],
  },
];

export async function up(db: Db) {
  console.log("Starting departments migration");
  try {
    const countBefore = await db.collection("departments").countDocuments();
    console.log(`Documents in departments before archiving: ${countBefore}`);

    // Fetch existing departments and archive them
    const existingDepartments = await db
      .collection("departments")
      .find({})
      .toArray();
    if (existingDepartments.length > 0) {
      const archivedDepartments = existingDepartments.map((dep) => ({
        ...dep,
        archivedAt: new Date(),
        source: "departments_migration",
      }));
      const archiveResult = await db
        .collection("archived_departments")
        .insertMany(archivedDepartments);
      console.log(
        `Archived ${archiveResult.insertedCount} documents to archived_departments`,
      );
    } else {
      console.log("No departments to archive");
    }

    // Delete existing departments
    const deleteResult = await db.collection("departments").deleteMany({});
    console.log(
      `Deleted ${deleteResult.deletedCount} documents from departments`,
    );

    // Insert new departments
    const insertResult = await db
      .collection("departments")
      .insertMany(departmentsData);
    console.log(
      `Inserted ${insertResult.insertedCount} documents into departments`,
    );

    console.log("Departments migration completed successfully");
  } catch (error) {
    console.error("Error in departments migration:", error);
    throw error;
  }
}

export async function down(db: Db) {
  console.log("Starting departments migration rollback");
  try {
    // Delete the newly inserted departments
    const deleteResult = await db.collection("departments").deleteMany({
      _id: { $in: departmentsData.map((d) => d._id) },
    });
    console.log(
      `Deleted ${deleteResult.deletedCount} documents from departments`,
    );

    // Restore archived departments
    const archivedDepartments = await db
      .collection("archived_departments")
      .find({
        source: "departments_migration",
      })
      .toArray();
    if (archivedDepartments.length > 0) {
      // Remove archive-specific fields before restoring
      const departmentsToRestore = archivedDepartments.map(
        ({ archivedAt, source, ...dep }) => dep,
      );
      const restoreResult = await db
        .collection("departments")
        .insertMany(departmentsToRestore);
      console.log(
        `Restored ${restoreResult.insertedCount} documents to departments`,
      );

      // Clean up archived departments
      await db.collection("archived_departments").deleteMany({
        source: "departments_migration",
      });
      console.log("Cleaned up archived_departments collection");
    } else {
      console.log("No archived departments to restore");
    }

    console.log("Departments migration rolled back successfully");
  } catch (error) {
    console.error("Error in departments rollback:", error);
    throw error;
  }
}
