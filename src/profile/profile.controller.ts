import {
  Controller,
  Get,
  Post,
  Patch,
  Request,
  UseInterceptors,
  UsePipes,
  Body,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, UpdateUserSchema } from '../database/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JoiValidationPipe } from 'pips/JoiValidationPipe';
import { imageFileFilter } from 'helper/FileHelper';

@Controller('/auth')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get('/profile')
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({ summary: 'Protected Route' })
  @ApiBearerAuth('accessToken')
  async getUserProfile(@Request() req) {
    const result = await this.profileService.getUserProfile(req.user);
    return result;
  }

  @Patch('/update-user')
  @UsePipes(new JoiValidationPipe(UpdateUserSchema))
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Protected Route' })
  async updateUser(@Body() Body, @Request() req) {
    const result = await this.profileService.updateUserProfile(
      req.user,
      req.body,
    );
    return result;
  }

  @Post('/update-profile-image')
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFileFilter,
  }))
  @ApiOperation({ summary: 'Protected Route' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateProfilePic(@UploadedFile() file, @Request() req) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (req.fileValidationError) {
      throw new BadRequestException(
        'Invalid file, Provide only jpeg, jpg, and png file',
      );
    }
    const result = await this.profileService.uploadFile(req.user, req.file);
    return result;
  }
}
