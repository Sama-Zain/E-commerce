import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { CategoryModel } from 'src/DB/Models/category.model';
import { CommonModule } from 'src/common/commonModule/common.module';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [UserModel, CommonModule, CategoryModel,CacheModule],
  controllers: [CategoryController],
  providers: [CategoryService,HttpCacheInterceptor],
})
export class CategoryModule {}
