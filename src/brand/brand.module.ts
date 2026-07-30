import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandModel } from 'src/DB/Models/brand.model';
import { CategoryModel } from 'src/DB/Models/category.model';
import { UserModel } from 'src/DB/Models/user.model';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/Token.service';
import { CommonModule } from 'src/common/commonModule/common.module';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [BrandModel, CategoryModel, CommonModule, UserModel,CacheModule],
  controllers: [BrandController],
  providers: [BrandService, JwtService, TokenService,HttpCacheInterceptor],
})
export class BrandModule {}
