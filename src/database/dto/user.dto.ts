import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import * as coreJoi from 'joi';
import * as joiDate from '@joi/date';

const Joi = coreJoi.extend(joiDate.default(coreJoi)) as typeof coreJoi;

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'testuser@gmal.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'akjskakskaks',
    description: "Check roles api to get the role",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: any;

  @IsNotEmpty()
  @IsDate()
  updatedAt: any;
}

export const registrationSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
  createdAt: Joi.date().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
  updatedAt: Joi.date().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
}).options({
  abortEarly: true,
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});
export const verifyTokenSchema = Joi.object({
  token: Joi.string().required(),
});
export const deviceTokenSchema = Joi.object({
  userId: Joi.string().required(),
  deviceToken: Joi.string().required(),
}).options({
  abortEarly: true,
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
  verifyId: Joi.string().required(),
}).options({
  abortEarly: true,
});

export class ValidateTokenDto {
  @ApiProperty({
    example: '***************',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    example: 'testuser@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty({
    example: 'testuser@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'test@123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({
    example: 'ajsghgweiyok',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  verifyId: string;
}

export class LoginDTO {
  @ApiProperty({
    example: 'testuser@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'test@123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto {
  // @ApiProperty({
  //   example: "John doe",
  //   required: true
  // })
  // @Optional()
  // @IsString()
  // name?: string;
}

export const UpdateUserSchema = Joi.object({
}).options({
  abortEarly: true,
});

export class UserProfileDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User display name' })
  name: string;

  @ApiProperty({ description: 'URL to user profile photo' })
  images: Array<string>;
}

export class UpdatePasswordDTO {
  @ApiProperty({
    example: 'test@123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'test@123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export const UpdatePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
}).options({
  abortEarly: true,
});