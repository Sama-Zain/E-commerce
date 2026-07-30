import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/createUserDto';
import { AuthService } from './Auth.service';
import { ConfirmEmailDto } from './DTO/confirm-emailDto';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/Utils/multer.utils';
import { LoginDto } from './DTO/loginDto';
import { TokenService } from 'src/common/services/Token.service';

@Controller('auth')
// @UsePipes(new SantizeUsernamePipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(LoggingInterceptor)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      success: true,
      message: 'User Registered Successfully',
      user: user,
    };
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return result;
  }

  @Patch('/conirm-email')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    await this.authService.confirmEmail(confirmEmailDto);
    return {
      success: true,
      message: 'Email Confirmed Successfully',
    };
  }

  @Patch('/profile-pic')
  @UseInterceptors(FileInterceptor('file', multerOption))
  async updateProfilePic(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { userId } = req as any;
    const filePath = file.path;
    const updatedUser = await this.authService.updateProfilePic(
      filePath,
      userId,
    );

    return {
      success: true,
      message: `profile pic updated successfully`,
      user: updatedUser,
    };
  }
}
