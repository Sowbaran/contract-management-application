import { ObjectId, Db } from "mongodb";

const workflowData = [
  {
    _id: new ObjectId("65e6c40f1bc6174e00ce714b"),
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    version: 1,
    workflowOrder: [
      {
        level: 1,
        role: new ObjectId("65def3f1de3deddff04f79a7"),
        name: "Executive General Manager",
        code: "executive-general-manager",
        isSpecificDeptApprover: true,
        includeOnRequesterCheck: false,
        limitFlag: false,
        min: 0,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 2,
        role: new ObjectId("65def477de3deddff04f79a8"),
        name: "Technology Admin",
        code: "technology-admin",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: true,
        deedOfNovation: false,
      },
      {
        level: 3,
        role: new ObjectId("65def505de3deddff04f79ab"),
        name: "Legal Admin",
        code: "legal-admin",
        limitFlag: true,
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        min: 20000,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: true,
      },
      {
        level: 4,
        role: new ObjectId("65def4b2de3deddff04f79a9"),
        name: "Insurance Admin",
        code: "insurance-admin",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 5,
        role: new ObjectId("65def510de3deddff04f79ac"),
        name: "Finance Admin",
        code: "finance-admin",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 6,
        role: new ObjectId("65def54ade3deddff04f79ad"),
        name: "CFO",
        code: "cfo",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: true,
      },
      {
        level: 7,
        role: new ObjectId("65def561de3deddff04f79ae"),
        name: "CEO",
        code: "ceo",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 250000,
        max: 1000000,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
    ],
    status: false,
    __v: 0,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date("2024-04-20T19:50:59.371Z"),
    updatedAt: new Date("2025-03-25T10:44:19.916Z"),
  },
  {
    _id: new ObjectId("6764352e6593044b04724433"),
    moduleId: new ObjectId("65e3579de0ca70fe8f2e148e"),
    version: 2,
    workflowOrder: [
      {
        level: 1,
        role: new ObjectId("676435d455a50e076bedab81"),
        name: "First Reviewer",
        code: "first-reviewer",
        min: 0,
        max: 0,
        limitFlag: false,
        isSpecificDeptApprover: true,
        includeOnRequesterCheck: true,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 2,
        role: new ObjectId("65def3f1de3deddff04f79a7"),
        name: "Executive General Manager",
        code: "executive-general-manager",
        min: 0,
        max: 250000,
        limitFlag: false,
        isSpecificDeptApprover: true,
        includeOnRequesterCheck: false,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 3,
        role: new ObjectId("65def477de3deddff04f79a8"),
        name: "Technology Admin",
        code: "technology-admin",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: true,
        deedOfNovation: false,
      },
      {
        level: 4,
        role: new ObjectId("65def505de3deddff04f79ab"),
        name: "Legal Admin",
        code: "legal-admin",
        limitFlag: false,
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        min: 0,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: true,
      },
      {
        level: 5,
        role: new ObjectId("65def4b2de3deddff04f79a9"),
        name: "Insurance Admin",
        code: "insurance-admin",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 6,
        role: new ObjectId("65def510de3deddff04f79ac"),
        name: "Finance Admin",
        code: "finance-admin",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 7,
        role: new ObjectId("65def54ade3deddff04f79ad"),
        name: "CFO",
        code: "cfo",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 20000,
        max: 250000,
        byPassWorkflow: false,
        deedOfNovation: true,
      },
      {
        level: 8,
        role: new ObjectId("65def561de3deddff04f79ae"),
        name: "CEO",
        code: "ceo",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        limitFlag: true,
        min: 250000,
        max: 1000000,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
    ],
    status: true,
    __v: 0,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "vrameshbapu@nrl.com.au",
    createdAt: new Date("2024-04-20T19:50:59.371Z"),
    updatedAt: new Date("2025-03-25T10:44:19.916Z"),
  },
  {
    _id: new ObjectId("665ab82da8d5cd84dd4e037c"),
    moduleId: new ObjectId("65e357e0e0ca70fe8f2e1490"),
    version: 1,
    workflowOrder: [
      {
        level: 1,
        role: new ObjectId("6651ded61c4f3f3ed5ea2284"),
        name: "P&C Business Partner",
        code: "p&c-business-partner",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 2,
        role: new ObjectId("6651deed1c4f3f3ed5ea2291"),
        name: "Finance Business Partner",
        code: "finance-business-partner",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 3,
        role: new ObjectId("676435d455a50e076bedab81"),
        name: "First Reviewer",
        code: "first-reviewer",
        isSpecificDeptApprover: true,
        includeOnRequesterCheck: false,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 4,
        role: new ObjectId("65def3f1de3deddff04f79a7"),
        name: "Executive General Manager",
        code: "executive-general-manager",
        isSpecificDeptApprover: true,
        includeOnRequesterCheck: false,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 5,
        role: new ObjectId("65def54ade3deddff04f79ad"),
        name: "CFO",
        code: "cfo",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
      {
        level: 6,
        role: new ObjectId("6651df421c4f3f3ed5ea22b8"),
        name: "Head of P&C",
        code: "head-of-p&c",
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        byPassWorkflow: false,
        deedOfNovation: false,
      },
    ],
    status: true,
    createdBy: "bbharathivel@nrl.com.au",
    updatedBy: "bbharathivel@nrl.com.au",
    createdAt: new Date("2024-11-21T14:39:12.423Z"),
    updatedAt: new Date("2025-04-01T12:07:37.987Z"),
  },
];

export async function up(db: Db) {
  console.log("Starting workflow migration");
  try {
    // Count documents before archiving
    const countBefore = await db.collection("workflow").countDocuments();
    console.log(`Documents in workflow before archiving: ${countBefore}`);

    // Archive existing workflows
    const existingWorkflows = await db
      .collection("workflow")
      .find({})
      .toArray();
    if (existingWorkflows.length > 0) {
      const archivedWorkflows = existingWorkflows.map((workflow) => ({
        ...workflow,
        archivedAt: new Date(),
        source: "workflow_migration",
      }));
      const archiveResult = await db
        .collection("archived_workflow")
        .insertMany(archivedWorkflows);
      console.log(
        `Archived ${archiveResult.insertedCount} documents to archived_workflow`,
      );
    } else {
      console.log("No workflows to archive");
    }

    // Delete existing workflows
    const deleteResult = await db.collection("workflow").deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} documents from workflow`);

    // Insert new workflows
    const insertResult = await db
      .collection("workflow")
      .insertMany(workflowData);
    console.log(
      `Inserted ${insertResult.insertedCount} documents into workflow`,
    );

    console.log("Workflow migration completed successfully");
  } catch (error) {
    console.error("Error in workflow migration:", error);
    throw error;
  }
}

export async function down(db: Db) {
  console.log("Starting workflow migration rollback");
  try {
    // Delete workflows added in up migration
    const deleteResult = await db.collection("workflow").deleteMany({
      _id: { $in: workflowData.map((w) => w._id) },
    });
    console.log(`Deleted ${deleteResult.deletedCount} documents from workflow`);

    // Restore archived workflows
    const archivedWorkflows = await db
      .collection("archived_workflow")
      .find({
        source: "workflow_migration",
      })
      .toArray();
    if (archivedWorkflows.length > 0) {
      // Remove archive-specific fields
      const workflowsToRestore = archivedWorkflows.map(
        ({ archivedAt, source, ...workflow }) => workflow,
      );
      const restoreResult = await db
        .collection("workflow")
        .insertMany(workflowsToRestore);
      console.log(
        `Restored ${restoreResult.insertedCount} documents to workflow`,
      );

      // Clean up archived_workflow
      await db.collection("archived_workflow").deleteMany({
        source: "workflow_migration",
      });
      console.log("Cleaned up archived_workflow collection");
    } else {
      console.log("No archived workflows to restore");
    }

    console.log("Workflow migration rolled back successfully");
  } catch (error) {
    console.error("Error in workflow rollback:", error);
    throw error;
  }
}
