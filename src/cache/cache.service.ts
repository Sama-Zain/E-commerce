import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client!: Redis
    async onModuleInit() {
        this.client = new Redis(process.env.REDIS_URI as string)
        this.client.on("connect", () => {
            console.log("Redis Cache Engine Connected Successully")
        });
        this.client.on("error", (err) => {
            console.log("Redis Client Error", err)
        })
    }
    async get(key:string){
        return this.client.get(key);
    }
    async set(key:string, value:string,ttlSecond=300){
        return this.client.set(key,value,"EX",ttlSecond);
    }
    async del(key:string){ //same key name user
        return this.client.del(key);
    }
    async delByPattern(pattern:string){
        const keys= await this.client.keys(pattern);
        if(keys.length> 0) await this.client.del(...keys)
    }
    async onModuleDestroy() {
        await this.client.quit();

    }
}
