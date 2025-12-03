import { ApiProperty } from "@nestjs/swagger";

export class UploadResponseDto {
  @ApiProperty({
    description: "Status message of the upload operation",
    example: "Document successfully uploaded",
  })
  message: string;

  @ApiProperty({
    description: "HTTP status code of the response",
    example: 200,
  })
  status: number;

  @ApiProperty({
    description: "The S3 location of the uploaded document",
    example:
      "https://my-sample-bucket.s3.ap-southeast-2.amazonaws.com/documents/sample.pdf",
  })
  data: string;
}  

export class HeadersDto {
    @ApiProperty({
      description: 'Amazon S3 unique ID for the request',
      example:
        'Vr9gGcRQUgYUvr9zrvvGjodqvmuHy5RUFiJuzWE6AdiEGVxaTPyImfH6nvoWtCArNvMBn/edNvaidcaANmQBtgwEto8DhbsGKs221EUtfno=',
    })
    xAmzId2: string;
  
    @ApiProperty({
      description: 'Amazon S3 request ID for tracking',
      example: 'XM5S9PNS8SNR45ST',
    })
    xAmzRequestId: string;
  
    @ApiProperty({
      description: 'Response date in GMT',
      example: 'Wed, 22 Jan 2025 04:42:07 GMT',
    })
    date: string;
  
    @ApiProperty({
      description: 'Last modified timestamp of the file',
      example: 'Thu, 21 Nov 2024 13:36:26 GMT',
    })
    lastModified: string;
  
    @ApiProperty({
      description: 'ETag value for the file',
      example: '"c7c238f45449268e4475c439327ba5d8"',
    })
    etag: string;
  
    @ApiProperty({
      description: 'Number of tags associated with the file',
      example: '2',
    })
    xAmzTaggingCount: string;
  
    @ApiProperty({
      description: 'Type of server-side encryption used',
      example: 'AES256',
    })
    xAmzServerSideEncryption: string;
  
    @ApiProperty({
      description: 'Range units accepted by the server',
      example: 'bytes',
    })
    acceptRanges: string;
  
    @ApiProperty({
      description: 'Content type of the file',
      example: 'application/pdf',
    })
    contentType: string;
  
    @ApiProperty({
      description: 'Size of the file in bytes',
      example: "314761",
    })
    contentLength: string;
  
    @ApiProperty({
      description: 'Server responding to the request',
      example: 'AmazonS3',
    })
    server: string;
  }

export class GenerateDownloadResponseDto {
  @ApiProperty({
    description: 'Data content as a string',
    example: 'JVBERi0xLjUKJfv8/f4KMTYgMCBvYmoKPDwvTGVuZ3RoIDI3MTYvRmlsdGVyL0ZsYXRlRGVjb2RlPj5zdHJlYW0KeJytGk2LLDfu3r+izoHpteSPsmFo6JmeCeSW3YE9hJySzYbw3sLmkr8fWbZlub5ed14YmLbLsiTrW64yZ5j+OP1/MpOhkU/+jFN0cI7T7/85/fub6X8nmPLf7/89+XCeJ/oXJxfhnKYZ49kT2PTLNwUB/RHYy8cJTZhmN08fP0//eIcJ4/Txyw/PBgwaa5zxJlye4NnM/D9e7LNJ5sqPf/z47vT2cfp+gXB2RDVEQ8xVnJBxDijNbGLDY17o+SuvBXo2mxv9vtGKo9G7CWAMAtCKo9GNn14Z9o12ZjyzSbQyAwCd5fLx2xZTLIrgEwlhZMoRaSIJ',
  })
  data: string;

  @ApiProperty({
    description: 'Headers containing metadata and file information',
    type: HeadersDto,
  })
  headers: HeadersDto;
}

export class GenerateDownloadResponseDataDto {
  @ApiProperty({
    description: "Base64 encoded string of the response data",
    example: "U29tZSBleGFtcGxlIHRleHQ=", // Example base64 string
  })
  data: string;

  @ApiProperty({
    description: "Headers of the response",
    example: {
      "content-type": "application/pdf",
      "content-length": "12345",
    },
  })
  headers: Record<string, string>;
}  

export class GeneratePreSignedUrlResponseDto {
    @ApiProperty({
      description: 'The URL of the client',
      example: 'https://example.com/resource/12345', 
    })
    getUrl: string;
  }