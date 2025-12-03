import { ObjectId, Db } from "mongodb";

const formModulesData = [
  {
    _id: new ObjectId("65e3579de0ca70fe8f2e148e"),
    name: "Contract Approval",
    code: "contract",
    description: "Contract Approval System",
    status: true,
    __v: 0,
    updatedAt: new Date(),
    createdAt: new Date(),
    updatedBy: "bbharathivel@nrl.com.au",
    createdBy: "bbharathivel@nrl.com.au",
  },
  {
    _id: new ObjectId("65def137de3deddff04f799b"),
    name: "Settings",
    code: "settings",
    description: "User Management and Settings",
    status: true,
    __v: 0,
    updatedAt: new Date(),
    createdAt: new Date(),
    updatedBy: "bbharathivel@nrl.com.au",
    createdBy: "bbharathivel@nrl.com.au",
  },
];

export async function up(db: Db) {
  console.log("Starting form_modules migration");
  try {
    const countBefore = await db.collection("form_modules").countDocuments();
    console.log(`Documents in form_modules before archiving: ${countBefore}`);

    // Fetch existing form_modules and archive them
    const existingFormModules = await db
      .collection("form_modules")
      .find({})
      .toArray();
    if (existingFormModules.length > 0) {
      const archivedFormModules = existingFormModules.map((fm) => ({
        ...fm,
        archivedAt: new Date(),
        source: "form_modules_migration",
      }));
      const archiveResult = await db
        .collection("archived_form_modules")
        .insertMany(archivedFormModules);
      console.log(
        `Archived ${archiveResult.insertedCount} documents to archived_form_modules`,
      );
    } else {
      console.log("No form_modules to archive");
    }

    // Delete existing form_modules
    const deleteResult = await db.collection("form_modules").deleteMany({});
    console.log(
      `Deleted ${deleteResult.deletedCount} documents from form_modules`,
    );

    // Insert new form_modules
    const insertResult = await db
      .collection("form_modules")
      .insertMany(formModulesData);
    console.log(
      `Inserted ${insertResult.insertedCount} documents into form_modules`,
    );

    console.log("Form_modules migration completed successfully");
  } catch (error) {
    console.error("Error in form_modules migration:", error);
    throw error;
  }
}

export async function down(db: Db) {
  console.log("Starting form_modules migration rollback");
  try {
    // Delete the newly inserted form_modules
    const deleteResult = await db.collection("form_modules").deleteMany({
      _id: { $in: formModulesData.map((fm) => fm._id) },
    });
    console.log(
      `Deleted ${deleteResult.deletedCount} documents from form_modules`,
    );

    // Restore archived form_modules
    const archivedFormModules = await db
      .collection("archived_form_modules")
      .find({
        source: "form_modules_migration",
      })
      .toArray();
    if (archivedFormModules.length > 0) {
      // Remove archive-specific fields before restoring
      const formModulesToRestore = archivedFormModules.map(
        ({ archivedAt, source, ...fm }) => fm,
      );
      const restoreResult = await db
        .collection("form_modules")
        .insertMany(formModulesToRestore);
      console.log(
        `Restored ${restoreResult.insertedCount} documents to form_modules`,
      );

      // Clean up archived_form_modules
      await db.collection("archived_form_modules").deleteMany({
        source: "form_modules_migration",
      });
      console.log("Cleaned up archived_form_modules collection");
    } else {
      console.log("No archived form_modules to restore");
    }

    console.log("Form_modules migration rolled back successfully");
  } catch (error) {
    console.error("Error in form_modules rollback:", error);
    throw error;
  }
}
