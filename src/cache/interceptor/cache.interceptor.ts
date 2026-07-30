import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RedisService } from '../cache.service';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
    constructor( private readonly redisService:RedisService){}
    async intercept(context: ExecutionContext, next: CallHandler):Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        if(request.methode !== "GET"){
            return next.handle();
        }
        const cacheKey = `cache:${request.originalUrl || request.url}`;
        try {
            const cachedData = await this.redisService.get(cacheKey)
            if(cacheKey){
                return of(JSON.parse(cachedData as string))
            }
        } catch (error) {
            console.error("Redis read failer safely skipped",error)
        }
        return next.handle().pipe(
            map(async(data) => {
            try {
                if(data){
                    await this.redisService.set(cacheKey,JSON.stringify(data),300)
                }
            } catch (error) {
                console.log("Redis write Failer");
                
            }
            }),
        );
    }
}
