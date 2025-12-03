import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SecretService {
  private readonly secretsManager: SecretsManager;
  private logger;

  constructor(private configService: ConfigService) {
    this.secretsManager = new SecretsManager({
      region: configService.get("REGION") || "ap-southeast-2",
    });
    this.logger = new Logger(SecretService.name);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getSecret(secretName: string): Promise<any> {
    try {
      const data = await this.secretsManager.getSecretValue({
        SecretId: secretName,
      });
      if ("SecretString" in data && data.SecretString) {
        return JSON.parse(data.SecretString);
      }
      throw new NotFoundException("Secret string is empty or not available.");
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async fetchSecret() {
    console.log(this.configService.get("ENVIRONMENT"));
    if (this.configService.get("ENVIRONMENT") === "local") {
      return {
        tenantId: this.configService.get("TENANT_ID"),
        clientId: this.configService.get("CLIENT_ID"),
        mongoUri: this.configService.get("MONGO_URI"),
        mongoDbName: this.configService.get("MONGO_DB_NAME"),

        signatureServiceAppName: this.configService.get(
          "SIGNATURE_SERVICE_APP_NAME",
        ),
        signatureServiceBasePath: this.configService.get(
          "SIGNATURE_SERVICE_BASEPATH",
        ),
        signatureServiceApiKey: this.configService.get(
          "SIGNATURE_SERVICE_API_KEY",
        ),
        signatureServiceApiVersion: this.configService.get(
          "SIGNATURE_SERVICE_API_VERSION",
        ),
        signatureServiceHMACKey: this.configService.get("SIGNATURE_HMAC_KEY"),
        communicationServiceBasePath: this.configService.get(
          "COMMUNICATION_SERVICE_BASEPATH",
        ),
        communicationServiceApiKey: this.configService.get(
          "COMMUNICATION_SERVICE_API_KEY",
        ),
        formSignatureCallbackPath: this.configService.get(
          "FORM_SIGNATURE_CALLBACK_PATH",
        ),
        formSignatureSigningUrlRetunPath: this.configService.get(
          "FORM_SIGNATURE_SIGNINGURL_RETURNPATH",
        ),
      };
    } else {
      const secretName = this.configService.get("SECRET_ARN");
      if (!secretName) {
        throw new InternalServerErrorException("Secret ARN is not provided");
      }
      const secrets = await this.getSecret(secretName);
      return {
        tenantId: secrets.TENANT_ID,
        clientId: secrets.CLIENT_ID,
        mongoUri: secrets.MONGO_URI,
        mongoDbName: secrets.MONGO_DB_NAME,

        signatureServiceAppName: secrets.SIGNATURE_SERVICE_APP_NAME,
        signatureServiceBasePath: secrets.SIGNATURE_SERVICE_BASEPATH,
        signatureServiceApiKey: secrets.SIGNATURE_SERVICE_API_KEY,
        signatureServiceApiVersion: secrets.SIGNATURE_SERVICE_API_VERSION,
        signatureServiceHMACKey: secrets.SIGNATURE_HMAC_KEY,

        communicationServiceBasePath: secrets.COMMUNICATION_SERVICE_BASEPATH,
        communicationServiceApiKey: secrets.COMMUNICATION_SERVICE_API_KEY,

        formSignatureCallbackPath: secrets.FORM_SIGNATURE_CALLBACK_PATH,
        formSignatureSigningUrlRetunPath:
          secrets.FORM_SIGNATURE_SIGNINGURL_RETURNPATH,
      };
    }
  }
}
