import { Module } from "@nestjs/common";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get<string>("ENVIRONMENT");

        if (environment === "local") {
          // Use local configuration for development
          const uri = configService.get<string>("MONGO_URI");
          const dbName = configService.get<string>("MONGO_DB_NAME");
          return { uri, dbName };
        } else {
          // Use AWS Secrets Manager for production
          const secretsManager = new SecretsManager({
            region: configService.get<string>("REGION") || "ap-southeast-2",
          });
          const secretName = configService.get<string>("SECRET_ARN") || "";
          const secretValue = await secretsManager.getSecretValue({
            SecretId: secretName,
          });

          const secret = JSON.parse(String(secretValue.SecretString));

          const uri = secret.MONGO_URI;
          const dbName = secret.MONGO_DB_NAME;
          return { uri, dbName };
        }
      },
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
