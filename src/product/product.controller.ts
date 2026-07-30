import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/services/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/Utils/multer.utils';
import { CreateProductDto } from './DTO/create.product.dto';
import { UpdateProductDto } from './DTO/update.product.dto';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  @UseInterceptors(HttpCacheInterceptor)
  async findByID(@Param('id') id: string) {
    return await this.productService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOption))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException(`product image is required`);

    const imageUrl = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`;
    const adminId = req.user._id;

    return await this.productService.create(
      createProductDto,
      imageUrl,
      adminId,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOption))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (file) {
      imageUrl = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`;
    }

    return await this.productService.update(id, updateProductDto, imageUrl);
  }
}
