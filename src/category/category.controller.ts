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
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/Utils/multer.utils';
import { CreateCategoryDto } from 'src/category/DTO/create.category.dto';
import { UpdateCategoryDto } from 'src/category/DTO/update.category.dto';
import { identity } from 'rxjs';
import { AuthGuard } from 'src/common/services/auth.guard';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
    @UseInterceptors(HttpCacheInterceptor)
  async findAll() {
    return this.categoryService.FindAll();
  }

  @Get(':id')
    @UseInterceptors(HttpCacheInterceptor)

  async findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOption))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: any,
  ) {
    if (!file) throw new NotFoundException(`A Category image file is required`);

    const logoUrl = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`;
    const adminId = req.user._id;

    return this.categoryService.create(createCategoryDto, logoUrl, adminId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOption))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    let logoUrl: string | undefined;
    if (file) {
      const logoUrl = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`;
    }
    return this.categoryService.update(updateCategoryDto, logoUrl, id);
  }
}
