import { getDbConfig } from "./migrate-mongo-config";
import { exec } from "child_process";
import { writeFileSync, existsSync, unlinkSync } from "fs";
import { join, resolve } from "path";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

async function runMigration(action: "up" | "down" | "downAll" | "status") {
  try {
    const dbConfig = await getDbConfig();
    console.log("DB Config:", JSON.stringify(dbConfig, null, 2));

    const tempConfigPath = join(__dirname, "temp-migrate-mongo-config.js");
    const migrationsDir = resolve(__dirname, "migrations");

    if (!existsSync(migrationsDir)) {
      throw new Error(`Migrations directory does not exist: ${migrationsDir}`);
    }

    // Use CommonJS syntax for migrate-mongo compatibility
    const tempConfig = `module.exports = ${JSON.stringify(
      {
        mongodb: {
          url: dbConfig.mongodb.url,
          databaseName: dbConfig.mongodb.databaseName,
        },
        migrationsDir: migrationsDir.replace(/\\/g, "/"), // Normalize Windows paths
        changelogCollectionName: "changelog",
        migrationFileExtension: ".ts",
      },
      null,
      2,
    )};`;
    writeFileSync(tempConfigPath, tempConfig);
    console.log("Temporary config file created at:", tempConfigPath);
    console.log("Temporary config content:", tempConfig);

    console.log(
      `Running migration '${action}' on DB: ${dbConfig.mongodb.databaseName}...`,
    );

    const projectRoot = resolve(__dirname, "../../../..");

    if (action === "downAll") {
      // NEW: Connect to MongoDB for changelog checks
      const client = new MongoClient(dbConfig.mongodb.url);
      await client.connect();
      const db = client.db(dbConfig.mongodb.databaseName);
      const changelogCollection = db.collection("changelog");

      // Run `down` until changelog collection is empty
      let changelogCount = await changelogCollection.countDocuments();
      console.log("changelogCount" + changelogCount);
      while (changelogCount > 0) {
        if (changelogCount === 0) {
          console.log(
            "Changelog collection is empty. No more migrations to roll back.",
          );
          if (existsSync(tempConfigPath)) {
            unlinkSync(tempConfigPath);
          }
          break;
        }

        // Run `down` for the most recent applied migration
        const downResult = await new Promise<string>((resolve, reject) => {
          const downCommand = `npx ts-node -r tsconfig-paths/register --transpile-only node_modules/migrate-mongo/bin/migrate-mongo down -f "${tempConfigPath}"`;
          exec(downCommand, { cwd: projectRoot }, (error, stdout, stderr) => {
            if (error) {
              reject(
                new Error(
                  `Migration down failed: ${error.message}\nStderr: ${stderr}`,
                ),
              );
              return;
            }
            console.log(`Stdout: ${stdout}`);
            if (stderr) {
              console.warn(`Stderr: ${stderr}`);
            }
            resolve(stdout);
          });
        });

        changelogCount--;
        console.log(
          `Rolled back migration ${changelogCount}: ${downResult.match(/MIGRATED DOWN: (.+)/)?.[1] || "unknown"}`,
        );
      }
      console.log(`Completed rolling back ${changelogCount} migrations.`);
      process.exit(0);
    } else {
      // Run single migration action (up, down, or status)
      const command = `npx ts-node -r tsconfig-paths/register --transpile-only node_modules/migrate-mongo/bin/migrate-mongo ${action} -f "${tempConfigPath}"`;
      await new Promise((resolve, reject) => {
        exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
          // Clean up the temp file
          if (existsSync(tempConfigPath)) {
            unlinkSync(tempConfigPath);
          }

          if (error) {
            console.error(`Migration failed: ${error.message}`);
            console.error(`Stderr: ${stderr}`);
            reject(
              new Error(`Command failed: ${error.message}\nStderr: ${stderr}`),
            );
            return;
          }
          console.log(`Stdout: ${stdout}`);
          if (stderr) {
            console.warn(`Stderr: ${stderr}`);
          }
          console.log("Migration completed successfully.");
          resolve(stdout);
        });
      });
    }
  } catch (err) {
    // Ensure temp file is cleaned up on error
    const tempConfigPath = join(__dirname, "temp-migrate-mongo-config.js");
    if (existsSync(tempConfigPath)) {
      unlinkSync(tempConfigPath);
    }
    console.error("Failed to load DB config or run migration:", err);
    throw err;
  }
}

const args = process.argv.slice(2);
const action = args[0] as "up" | "down" | "downAll" | "status";
const environment = args[1] || process.env.NODE_ENV || "dev";
const runAll = args[2] === "--all";

if (!["up", "down", "downAll", "status"].includes(action)) {
  console.error("Invalid migration action. Use 'up', 'down', or 'status'.");
  process.exit(1);
}

runMigration(action)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration process failed:", err);
    process.exit(1);
  });
