import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { SecretService } from "./../../../../src/secret/secret.service";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";

dotenv.config();
if (process.env.IS_LOCAL !== "true") {
  dotenv.config({ path: "./.env" });
  console.log("Loading CI/CD .env from: ./.env");
}
export async function getDbConfig() {
  const getDbName = process.env.MONGO_DB_NAME;
  const dbMONGO_URI = process.env.MONGO_URI?.trim();

  try {
    const uri = dbMONGO_URI;
    const dbName = getDbName; // Adjust key based on secret structure

    if (!uri || !dbName) {
      throw new Error(
        "Missing MONGO_URI or MONGO_DB_NAME_V3 in secret or environment",
      );
    }

    return {
      mongodb: {
        url: uri,
        databaseName: dbName,
      },
      migrationsDir: "libs/common/src/database/migrations",
      changelogCollectionName: "changelog",
      migrationFileExtension: ".ts",
    };
  } catch (error) {
    console.error("Error fetching secrets from AWS Secrets Manager:", error);
    throw error;
  }
}

// Export the async function directly; handled in migrate.ts
export default getDbConfig;
