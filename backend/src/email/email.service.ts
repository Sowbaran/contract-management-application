import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  protected readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmailWithTemplate(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    recipient: any,
    subject: string,
    body: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    cc?: any,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: recipient,
      subject: subject,
      html: body,
      ...(cc && { cc: cc }),
    };

    try {
      this.logger.log(
        `Sending email to ${recipient} with subject: ${subject}`,
      );
      await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email successfully dispatched to ${recipient as string}`,
      );
      console.log('\n========================================');
      console.log('✅ ✅ ✅ MAIL IS SENT SUCCESSFULLY!!! ✅ ✅ ✅');
      console.log('========================================\n');
    } catch (error) {
      this.logger.error(`sendEmailTemplate error ${error}`);
      throw new InternalServerErrorException(
        `sendEmailTemplate error ${error}`,
      );
    }
  }
}
