import { ObjectId, Db } from "mongodb";

export async function up(db: Db) {
  console.log("Starting form_details migration");
  try {
    // Count documents before archiving
    const countBefore = await db.collection("form_details").countDocuments();
    console.log(`Documents in form_details before archiving: ${countBefore}`);

    // Archive existing form_details
    const existingFormDetails = await db
      .collection("form_details")
      .find({})
      .toArray();
    if (existingFormDetails.length > 0) {
      const archivedFormDetails = existingFormDetails.map((form) => ({
        ...form,
        archivedAt: new Date(),
        source: "form_details_migration",
      }));
      const archiveResult = await db
        .collection("archived_form_details")
        .insertMany(archivedFormDetails);
      console.log(
        `Archived ${archiveResult.insertedCount} documents to archived_form_details`,
      );
    } else {
      console.log("No form_details to archive");
    }

    // Step 1: Update moduleCode from "vendor-contract" to "contract"
    const moduleCodeResult = await db
      .collection("form_details")
      .updateMany(
        { moduleCode: "vendor-contract" },
        { $set: { moduleCode: "contract" } },
      );
    console.log(
      `Step 1: Updated moduleCode in ${moduleCodeResult.modifiedCount} documents`,
    );

    // Step 2: Rename created_by to createdBy
    const createdByResult = await db
      .collection("form_details")
      .updateMany(
        { created_by: { $exists: true } },
        { $rename: { created_by: "createdBy" } },
      );
    console.log(
      `Step 2: Renamed created_by to createdBy in ${createdByResult.modifiedCount} documents`,
    );

    // Step 3: Rename created_at to createdAt
    const createdAtResult = await db
      .collection("form_details")
      .updateMany(
        { created_at: { $exists: true } },
        { $rename: { created_at: "createdAt" } },
      );
    console.log(
      `Step 3: Renamed created_at to createdAt in ${createdAtResult.modifiedCount} documents`,
    );

    // Step 4: Rename updated_at to updatedAt
    const updatedAtResult = await db
      .collection("form_details")
      .updateMany(
        { updated_at: { $exists: true } },
        { $rename: { updated_at: "updatedAt" } },
      );
    console.log(
      `Step 4: Renamed updated_at to updatedAt in ${updatedAtResult.modifiedCount} documents`,
    );

    // Step 5: Convert formHistory.created_at (numberLong) to createdAt (Date) and rename
    const formHistoryRenameResult = await db
      .collection("form_details")
      .updateMany({}, [
        {
          $set: {
            formHistory: {
              $map: {
                input: "$formHistory",
                as: "history",
                in: {
                  $mergeObjects: [
                    "$$history",
                    { createdAt: "$$history.created_at" },
                  ],
                },
              },
            },
          },
        },
      ]);
    console.log(
      `Step 5: Renamed formHistory.created_at to createdAt in ${formHistoryRenameResult.modifiedCount} documents`,
    );

    // Step 6: Remove formHistory.created_at and set version to 2
    const formHistoryRemoveResult = await db
      .collection("form_details")
      .updateMany(
        {},
        {
          $unset: { "formHistory.$[].created_at": "" },
          $set: { version: "V1" },
        },
      );
    console.log(
      `Step 6: Removed formHistory.created_at and set version to 2 in ${formHistoryRemoveResult.modifiedCount} documents`,
    );

    // Step 7: Add code, deedOfNovation, and byPassWorkflow to workflowOrder
    const workflowOrderBaseResult = await db
      .collection("form_details")
      .updateMany({}, [
        {
          $set: {
            workflowOrder: {
              $map: {
                input: "$workflowOrder",
                as: "order",
                in: {
                  $mergeObjects: [
                    "$$order",
                    {
                      code: {
                        $cond: [
                          {
                            $and: [
                              {
                                $eq: [
                                  "$$order.name",
                                  "Executive General Manager",
                                ],
                              },
                              {
                                $eq: [
                                  "$$order.roleId",
                                  new ObjectId("65def3f1de3deddff04f79a7"),
                                ],
                              },
                            ],
                          },
                          "executive-general-manager",
                          {
                            $cond: [
                              {
                                $and: [
                                  { $eq: ["$$order.name", "Technology Admin"] },
                                  {
                                    $eq: [
                                      "$$order.roleId",
                                      new ObjectId("65def477de3deddff04f79a8"),
                                    ],
                                  },
                                ],
                              },
                              "technology-admin",
                              {
                                $cond: [
                                  {
                                    $and: [
                                      { $eq: ["$$order.name", "Legal Admin"] },
                                      {
                                        $eq: [
                                          "$$order.roleId",
                                          new ObjectId(
                                            "65def505de3deddff04f79ab",
                                          ),
                                        ],
                                      },
                                    ],
                                  },
                                  "legal-admin",
                                  {
                                    $cond: [
                                      {
                                        $and: [
                                          {
                                            $eq: [
                                              "$$order.name",
                                              "Insurance Admin",
                                            ],
                                          },
                                          {
                                            $eq: [
                                              "$$order.roleId",
                                              new ObjectId(
                                                "65def4b2de3deddff04f79a9",
                                              ),
                                            ],
                                          },
                                        ],
                                      },
                                      "insurance-admin",
                                      {
                                        $cond: [
                                          {
                                            $and: [
                                              {
                                                $eq: [
                                                  "$$order.name",
                                                  "Finance Admin",
                                                ],
                                              },
                                              {
                                                $eq: [
                                                  "$$order.roleId",
                                                  new ObjectId(
                                                    "65def510de3deddff04f79ac",
                                                  ),
                                                ],
                                              },
                                            ],
                                          },
                                          "finance-admin",
                                          {
                                            $cond: [
                                              {
                                                $and: [
                                                  {
                                                    $eq: [
                                                      "$$order.name",
                                                      "CFO",
                                                    ],
                                                  },
                                                  {
                                                    $eq: [
                                                      "$$order.roleId",
                                                      new ObjectId(
                                                        "65def54ade3deddff04f79ad",
                                                      ),
                                                    ],
                                                  },
                                                ],
                                              },
                                              "cfo",
                                              {
                                                $cond: [
                                                  {
                                                    $and: [
                                                      {
                                                        $eq: [
                                                          "$$order.name",
                                                          "CEO",
                                                        ],
                                                      },
                                                      {
                                                        $eq: [
                                                          "$$order.roleId",
                                                          new ObjectId(
                                                            "65def561de3deddff04f79ae",
                                                          ),
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                  "ceo",
                                                  "unknown-role",
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      deedOfNovation: false,
                      byPassWorkflow: false,
                    },
                  ],
                },
              },
            },
          },
        },
      ]);
    console.log(
      `Step 7: Added base fields to workflowOrder in ${workflowOrderBaseResult.modifiedCount} documents`,
    );

    // Step 8: Add isSpecificDeptApprover, includeOnRequesterCheck, deedOfNovation, and byPassWorkflow to workflowOrder
    const workflowOrderExtraResult = await db
      .collection("form_details")
      .updateMany({ workflowOrder: { $exists: true } }, [
        {
          $set: {
            workflowOrder: {
              $map: {
                input: "$workflowOrder",
                as: "order",
                in: {
                  $mergeObjects: [
                    "$$order",
                    {
                      isSpecificDeptApprover: {
                        $cond: [
                          {
                            $and: [
                              {
                                $eq: [
                                  "$$order.name",
                                  "Executive General Manager",
                                ],
                              },
                              {
                                $eq: [
                                  "$$order.roleId",
                                  new ObjectId("65def3f1de3deddff04f79a7"),
                                ],
                              },
                            ],
                          },
                          true,
                          false,
                        ],
                      },
                      includeOnRequesterCheck: false,
                      deedOfNovation: false,
                      byPassWorkflow: false,
                    },
                  ],
                },
              },
            },
          },
        },
      ]);
    console.log(
      `Step 8: Added extra fields to workflowOrder in ${workflowOrderExtraResult.modifiedCount} documents`,
    );

    console.log("form_details migration completed successfully");
  } catch (error) {
    console.error("Error in form_details migration:", error);
    throw error;
  }
}

export async function down(db: Db) {
  console.log("Starting form_details migration rollback");
  try {
    // Count documents before restoration
    const countBefore = await db.collection("form_details").countDocuments();
    console.log(`Documents in form_details before restoration: ${countBefore}`);

    // Restore archived form_details
    const archivedFormDetails = await db
      .collection("archived_form_details")
      .find({
        source: "form_details_migration",
      })
      .toArray();
    if (archivedFormDetails.length > 0) {
      let restoredCount = 0;
      for (const archivedForm of archivedFormDetails) {
        // Remove archive-specific fields and version
        const { archivedAt, source, ...formToRestore } = archivedForm;
        // Restore original document structure by replacing the document with matching _id
        const updateResult = await db
          .collection("form_details")
          .updateOne(
            { _id: archivedForm._id },
            { $set: formToRestore, $unset: { version: "" } },
            { upsert: false },
          );
        if (updateResult.modifiedCount > 0) {
          restoredCount++;
        }
      }
      console.log(
        `Restored ${restoredCount} documents to their pre-migration state in form_details`,
      );

      // Clean up archived_form_details
      await db.collection("archived_form_details").deleteMany({
        source: "form_details_migration",
      });
      console.log("Cleaned up archived_form_details collection");
    } else {
      console.log("No archived form_details to restore");
    }

    console.log("form_details migration rolled back successfully");
  } catch (error) {
    console.error("Error in form_details rollback:", error);
    throw error;
  }
}
