import { BadRequestException } from '@nestjs/common';
import multer from 'multer';

export const verifyUploadFile = {
  fileFilter: (
    req: any,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    if (
      file?.fieldname === 'image' &&
      !file?.originalname?.match(/\.(png|jpeg|jpg)$/)
    ) {
      return callback(
        new BadRequestException(
          'Only .png and .jpeg files are allowed for images',
        ),
      );
    }
    if (
      file.fieldname === 'music_track' &&
      !file.originalname.match(/\.(mp3|mp4)$/)
    ) {
      return callback(
        new BadRequestException(
          'Only .mp3 and .mp4 files are allowed for audio',
        ),
      );
    }
    callback(null, true);
  },
};
