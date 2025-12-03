import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";
import axios from "axios";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FormDetailsRepository } from "@app/common";
import { FormStatus } from "../constants";
import { GenerateDownloadResponseDto, GeneratePreSignedUrlResponseDto, HeadersDto, UploadResponseDto, UrlDto } from "@src/document-handler/dto";
import { plainToInstance } from "class-transformer";
dotenv.config();

@Injectable()
export class DocumentHandlerService {
  protected readonly logger = new Logger(DocumentHandlerService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    private formDetailsRepo: FormDetailsRepository,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({ region: configService.get("REGION") });
    this.bucketName = configService.get("AWS_S3_BUCKET") || "";
  }

  async generateSignedUrl(key: string, ContentType: string): Promise<UrlDto> {
    if (key.includes(" ")) {
      throw new Error("Key cannot contain spaces.");
    }
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: ContentType,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return { url };
  }

  async updateFormStatus(formId: string, s3Location: string): Promise<UploadResponseDto> {
    const query = { _id: formId };
    const projection =
      "formInfo createdBy department workflow workflowName departmentName -_id";
    const formDetails = await this.formDetailsRepo.findOne(query, projection);
    const createdBy = formDetails.createdBy;
    const workflow = formDetails.workflow;
    const department = formDetails.department;
    const departmentName = formDetails.departmentName;
    const workflowName = formDetails.workflowName;

    const updateQuery = { _id: formId };
    const update = {
      $set: { status: FormStatus.FULFILLED },
      $push: {
        msaAttachments: s3Location,
        formHistory: {
          approvedBy: createdBy,
          status: FormStatus.FULFILLED,
          workflow,
          workflowName,
          department,
          departmentName,
          createdAt: Date.now(),
        },
      },
    };
    const updatedForm = await this.formDetailsRepo.findOneAndUpdate(
      updateQuery,
      update,
    );
    if (!updatedForm) {
      this.logger.error(`form not found ${formId}`);
      throw new NotFoundException(`Form #${formId} not found`);
    }
    return {
      message: `Document successfully uploaded`,
      status: 200,
      data: s3Location,
    };
  }

  async generateDownload(url: string): Promise<GenerateDownloadResponseDto> {
    try {
      const clientUrl = await this.createPreSignedUrlWithClient(
        url,
        "download",
      );
      const response = await axios.get(clientUrl, {
        responseType: "arraybuffer",
      });
      const headerData = plainToInstance(HeadersDto, response.headers);
      return  { data: response.data.toString("base64"), headers: headerData };
    } catch (error) {
      this.logger.error(`Error generating pre-signed URL ${error}`);
      throw error;
    }
  }

  async generatePreSignedUrl(url: string): Promise<GeneratePreSignedUrlResponseDto> {
    const clientUrl = await this.createPreSignedUrlWithClient(url, "download");
    return { getUrl: clientUrl };
  }

  async createPreSignedUrlWithClient(
    key: string,
    type: string,
    contentType?: string,
  ): Promise<string> {
    try {
      let command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });
      if (type === "download") {
        command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
      }
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      this.logger.error(`${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
