import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'

@Injectable()
export class AwsS3Service {
  private readonly s3: AWS.S3
  constructor() {
    this.s3 = new AWS.S3({ region: process.env.AWS_REGION })
  }

  public async uploadFile(
    buffer: Buffer,
    photo: string,
    folder: string,
  ): Promise<string> {
    const { Key } = await this.s3
      .upload({
        Bucket: process.env.BUCKET_NAME,
        Key:
          `${folder}/${(~~(Math.random() * 1e8)).toString(16)}_` +
          photo
            .replaceAll(/\s/g, '')
            .replaceAll(/\\/g, '')
            .replaceAll(/,/g, '')
            .replaceAll(new RegExp('/', 'g'), ''),
        Body: buffer,
      })
      .promise()
    return Key
  }

  public getUrl(filename: string): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Expires: 60 * 60 * 3,
    })
  }

  public async deleteFile(filename: string): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
      })
      .promise()
  }
}
