import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { IdParamDTO } from 'src/common-dto/id-param.dto'
import { RequestParam } from 'src/decorators/request-params.decorator'
import UpdatePhoneDTO from './dto/update-phone.dto'
import UserUpdateDTO from './dto/update-user.dto'
import UserDTO from './dto/user.dto'
import { UserService } from './user.service'
import { PhotoValidationPipe } from '../validation/photoValidation'
import { RequestHeader } from 'src/decorators/request-header.decorator'
import { UserSdkRepsonseDTO } from './dto/user-sdk-response.dto'
import { UserSdkGuard } from 'src/auth/guards/user-sdk.guard'
import TokenHeaderDTO from 'src/common-dto/token-header.dto'
import { UserGuard } from 'src/auth/guards/user.guard'

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 204,
    description: 'Profile was deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: `Profile with this id doesn't exist`,
  })
  @ApiResponse({
    status: 403,
    description: 'This profile is not yours',
  })
  public deleteUser(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<void> {
    return this.userService.deleteUser(id, token)
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @UsePipes(new PhotoValidationPipe())
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'User was succesfully updated',
    type: UserDTO,
  })
  @ApiResponse({
    status: 400,
    description: `User with this id doesn't exist or problem with file uploading(format, size) or invalid phone`,
  })
  @ApiResponse({
    status: 403,
    description: `This token doesn't belong you`,
  })
  @ApiResponse({
    status: 409,
    description: `This user is not yours or User with this phone already exist`,
  })
  public async updateUserProfile(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() body: UserUpdateDTO,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<UserDTO> {
    return this.userService.updateUserProfile(id, body, photo)
  }

  @UseGuards(UserGuard)
  @Patch('confirm-phone/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'User was succesfully updated',
    type: UserDTO,
  })
  @ApiResponse({
    status: 400,
    description: `User with this id doesn't exist`,
  })
  @ApiResponse({
    status: 403,
    description: `This token doesn't belong you`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid phone or code',
  })
  public async confirmPhoneUpdate(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() body: UpdatePhoneDTO,
  ): Promise<UserDTO> {
    return this.userService.confirmPhoneUpdate(id, body)
  }

  @UseGuards(UserGuard)
  @Delete('avatar/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @HttpCode(204)
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 204,
    description: 'Avatar was successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: `User with this id doesn't exist or user doesn't have avatar`,
  })
  @ApiResponse({
    status: 403,
    description: `This token doesn't belong you`,
  })
  public async deleteUserAvatar(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<void> {
    return this.userService.deleteAvatar(token)
  }

  @UseGuards(UserSdkGuard)
  @Get('verify')
  @ApiExcludeEndpoint()
  public verifyUser(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<UserSdkRepsonseDTO> {
    return this.userService.verifyUser(token)
  }

  @UseGuards(UserSdkGuard)
  @Get(':id')
  @ApiExcludeEndpoint()
  public getById(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<UserSdkRepsonseDTO> {
    return this.userService.getById(id)
  }
}
