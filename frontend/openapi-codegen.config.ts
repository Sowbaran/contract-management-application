import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
import dotenv from 'dotenv';

dotenv.config();
const baseUrl = process.env.VITE_API_URL ?? '';

export default defineConfig({
  backend: {
    from: {
      source: "url",
      url: `${baseUrl}/swagger-json`,
    },
    outputDir: "./src/api/backend",
    to: async (context) => {
      const filenamePrefix = "backend";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});

