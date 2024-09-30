import { Controller, Get, Post, Body, Req, Request, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, ForgotPasswordDTO, LoginDTO, ResetPasswordDTO, ValidateTokenDto, deviceTokenSchema, forgotPasswordSchema, registrationSchema, resetPasswordSchema, verifyTokenSchema } from '../database/dto/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { JoiValidationPipe } from 'pips/JoiValidationPipe';

class DeviceTokenInterface {
  @ApiProperty({
    example: 'akdhsjkjjkasmnbna',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'kaheyiwndyiwhcixj',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  deviceToken: string;
}

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(new JoiValidationPipe(registrationSchema))
  @ApiResponse({ status: 201, description: 'User registerd successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.create(createUserDto);
    return result;
  }

  @Post('/verify-token')
  @UsePipes(new JoiValidationPipe(verifyTokenSchema))
  @ApiBody({
    type: ValidateTokenDto,
  })
  async verifyToken(@Body() data: ValidateTokenDto) {
    const result = await this.authService.verifyToken(data['token']);
    return result;
  }

  @Post('/forgot-password')
  @UsePipes(new JoiValidationPipe(forgotPasswordSchema))
  @ApiBody({
    type: ForgotPasswordDTO,
  })
  async ForgotPassword(@Body() data: ForgotPasswordDTO) {
    const result = await this.authService.sendPasswordResetEmail(data['email']);
    return result;
  }

  @Post('/reset-password')
  @UsePipes(new JoiValidationPipe(resetPasswordSchema))
  @ApiBody({
    type: ResetPasswordDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Password Reset successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async ResetPassword(@Body() data: ResetPasswordDTO) {
    const result = await this.authService.resetPassword(
      data['email'],
      data['newPassword'],
      data["verifyId"]
    );
    return result;
  }

  @Post('/login')
  @ApiBody({
    type: LoginDTO,
  })
  async loginUser(@Body() data: LoginDTO) {
    const result = await this.authService.loginUser(data.email, data.password);
    return result;
  }

  @Get('/roles')
  async getAllRoles(@Req() req: any) {
    const result = await this.authService.getRoles();
    return result;
  }

  @Post("/device-token")
  @UsePipes(new JoiValidationPipe(deviceTokenSchema))
  @ApiBody({
    type: DeviceTokenInterface,
  })
  async saveDeviceToken(@Body() req) {
    const result = this.authService.saveToken(req.userId, req.deviceToken)
    return result
  }
}
