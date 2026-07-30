import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { BrandModel } from 'src/DB/Models/brand.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/Token.service';
import { ProductModel } from 'src/DB/Models/product.model';
import { CategoryModel } from 'src/DB/Models/category.model';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [ProductModel, UserModel, CategoryModel, BrandModel,CacheModule],
  controllers: [ProductController],
  providers: [ProductService, JwtService, TokenService,HttpCacheInterceptor],
})
export class ProductModule {}
