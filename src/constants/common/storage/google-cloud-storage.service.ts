import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { logger } from '../../../config/logger';
import * as QRCode from 'qrcode';

@Injectable()
export class UploadService {
  private storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  async uploadFile(
    file: Express.Multer.File,
    bucketName?,
    newBucket = null,
  ): Promise<string> {
    try {
      logger.info('=====uploadFile request initiated=====');
      return new Promise((resolve, reject) => {
        let fileOriginalName = file.originalname;
        if (newBucket) {
          fileOriginalName = `${newBucket}/${fileOriginalName}`;
        }
        const currentBucket =
          bucketName && bucketName !== 'posts'
            ? process.env.PROFILES_BUCKET_NAME
            : process.env.POSTS_BUCKET;
        const bucket = this.storage.bucket(currentBucket);

        const blob = bucket.file(fileOriginalName);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });

        blobStream.on('error', (err) => {
          logger.error(err);
          reject(err);
        });

        blobStream.on('finish', async () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          logger.info(publicUrl);
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      logger.error(error);
      return error;
    }
  }
}