import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GenerateSignedUrlQueryparamsDto {
  @ApiProperty({
    description: "Message related to the form",
    required: true,
    example: "sample.pdf",
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: "Message related to the form",
    required: true,
    example: "pdf",
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;
}

export class UrlDto {
  @ApiProperty({
    description: "The URL for accessing the object in S3",
    example:
      "https://dev-form-builder-ent-bucket.s3.ap-southeast-2.amazonaws.com/sample.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA2SFQEUYDQJY3IFC3%2F20250115%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250115T061248Z&X-Amz-Expires=3600&X-Amz-Security-Token=FwoGZXIvYXdzEEAaDA7z7%2FUx9pOluKIQUiKcAjX4Nw%2BTsZke5bMKKLJSRO9qGmURHFhAwtLnevQVBG4Z9shcFDR3tQ4sE2yeTgKq7KEBOrAJuMKWY13u%2FncJMR%2FmXWlapStZS5giML8mW%2BcmcbFUMnysdUMduVMCXAYV%2F5kul1Rq8NSnYz%2BVkC67hDjS%2B78QRGiC0yUB8JLw3F%2BQ02dhtXDferMZoSNsBe6TBDIayWw9OVjHRlSGE7GDYvRbw5Wf319alW8qPWUlzMp%2BruSeYQyVxVJrvrP4JriBcd6plEbJ6yOCsC2sGPqbzF7ciFJEW2am2yd2u6qEAu74Tb6M1F5hk899s3ZgtsuG0PUiex8z7w%2F1UW8%2FabrO9FRTDcq7jGAVXQLt7ZD1yE6Hb7iFP5y7yYg6SQ1hKIGjnbwGMiqLZf9iGcvSatG6x7s%2Bp5o%2FYY69Qtn08nLtsWzGR7G8UJ1Y0nsNORKxZVA%3D&X-Amz-Signature=16b24def903c8acb307bd10caa7bdf95a45d708516f540a3ae29d1e2e814109c&X-Amz-SignedHeaders=host&x-id=PutObject",
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class PreSignedUrlDto {
  @ApiProperty({
    description: "The URL which has to be pre signed",
    example:
      "https://dev-form-builder-ent-bucket.s3.ap-southeast-2.amazonaws.com/sample.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA2SFQEUYDQJY3IFC3%2F20250115%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250115T061248Z&X-Amz-Expires=3600&X-Amz-Security-Token=FwoGZXIvYXdzEEAaDA7z7%2FUx9pOluKIQUiKcAjX4Nw%2BTsZke5bMKKLJSRO9qGmURHFhAwtLnevQVBG4Z9shcFDR3tQ4sE2yeTgKq7KEBOrAJuMKWY13u%2FncJMR%2FmXWlapStZS5giML8mW%2BcmcbFUMnysdUMduVMCXAYV%2F5kul1Rq8NSnYz%2BVkC67hDjS%2B78QRGiC0yUB8JLw3F%2BQ02dhtXDferMZoSNsBe6TBDIayWw9OVjHRlSGE7GDYvRbw5Wf319alW8qPWUlzMp%2BruSeYQyVxVJrvrP4JriBcd6plEbJ6yOCsC2sGPqbzF7ciFJEW2am2yd2u6qEAu74Tb6M1F5hk899s3ZgtsuG0PUiex8z7w%2F1UW8%2FabrO9FRTDcq7jGAVXQLt7ZD1yE6Hb7iFP5y7yYg6SQ1hKIGjnbwGMiqLZf9iGcvSatG6x7s%2Bp5o%2FYY69Qtn08nLtsWzGR7G8UJ1Y0nsNORKxZVA%3D&X-Amz-Signature=16b24def903c8acb307bd10caa7bdf95a45d708516f540a3ae29d1e2e814109c&X-Amz-SignedHeaders=host&x-id=PutObject",
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class UpdateFormRequestDto {
  @ApiProperty({
    description: "Id of the form",
    example: "673f2a34ac9471b25fdb5792",
  })
  @IsString()
  @IsNotEmpty()
  formId: string;

  @ApiProperty({
    description: "Location path of s3",
    example: "s3://my-sample-bucket/documents/sample.pdf ./local-directory/",
  })
  @IsString()
  @IsNotEmpty()
  s3Location: string;
}

export class GenerateDownloadDto {
  @ApiProperty({
    description: "url for file download",
    example: "msadocuments/form_20240924T051744386Z_61709.pdf",
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
