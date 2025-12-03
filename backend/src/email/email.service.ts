import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { SecretService } from "../secret/secret.service";
import { commonDomainEndPaths } from "../constants";

@Injectable()
export class EmailService implements OnModuleInit {
  protected readonly logger = new Logger(EmailService.name);
  private communicationServiceApiKey: string;
  private communicationServiceBasePath: string;
  constructor(
    private readonly httpService: HttpService,
    private secretService: SecretService,
  ) {}

  async onModuleInit() {
    const secrets = await this.secretService.fetchSecret();
    this.communicationServiceApiKey = secrets.communicationServiceApiKey;
    this.communicationServiceBasePath = secrets.communicationServiceBasePath;
  }

  async sendEmailWithTemplate(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    recipient: any,
    subject: string,
    body: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    cc?: any,
  ): Promise<void> {
    const data = {
      to: recipient,
      subject: subject,
      html: body,
      ...(cc && { cc: cc }), // Conditionally add the cc field if it exists
    };
    try {
      this.logger.log(
        `Enter into communication service with payload: ${JSON.stringify(data)}`,
      );
      await firstValueFrom(
        this.httpService.post(
          `${this.communicationServiceBasePath}${commonDomainEndPaths.EMAILWITHHTML}`,
          data,
          {
            headers: {
              "x-api-key": this.communicationServiceApiKey,
            },
          },
        ),
      );
      this.logger.log(
        `Email successfully dispatched to ${recipient as string}`,
      );
    } catch (error) {
      this.logger.error(`sendEmailTemplate error ${error}`);
      throw new InternalServerErrorException(
        `sendEmailTemplate error ${error}`,
      );
    }
  }
}
