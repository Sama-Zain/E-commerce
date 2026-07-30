import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { AuthGuard } from 'src/common/services/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/Utils/multer.utils';
import { CreateBrandDto } from './DTO/create-brand.dto';
import { UpdateBrandDto } from './DTO/update.brand.dto';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Get()
    @UseInterceptors(HttpCacheInterceptor)
  async findAll() {
    return this.brandService.FindAll();
  }

  @Get(':id')
    @UseInterceptors(HttpCacheInterceptor)
  async findById(@Param('id') id: string) {
    return this.brandService.findById(id);
  }
  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOption))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBrandDto: CreateBrandDto,
    @Req() req: any,
  ) {
    if (!file) throw new NotFoundException(`A Brand image file is required`);

    const logoUrl = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`;
    const adminId = req.user._id;

    return this.brandService.create(createBrandDto, logoUrl, adminId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOption))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBrandDto: UpdateBrandDto,
    @Param('id') id: string,
  ) {
    let logoUrl: string | undefined;
    if (file) {
      const logoUrl = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`;
    }
    return this.brandService.update(updateBrandDto, id, logoUrl);
  }
}
