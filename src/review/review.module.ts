import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { ReviewModel } from 'src/DB/Models/review.model';
import { ProductModel } from 'src/DB/Models/product.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/Token.service';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [UserModel, ReviewModel, ProductModel,CacheModule],
  controllers: [ReviewController],
  providers: [ReviewService, JwtService, TokenService,HttpCacheInterceptor],
})
export class ReviewModule {}
