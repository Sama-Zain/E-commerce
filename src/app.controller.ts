import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

export interface Cat {
  name: string;
  age: number;
  breed: string;
}

@Controller('cats')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  //injecting the service into the controller
  @Post()
  create(@Body() cat: Cat) {
    this.appService.create(cat);
    return 'Cat created successfully by DI';
  }

  @Get('all')
  getallcats() {
    return this.appService.getAll();
  }
  //---------

  @Get('port')
  getPort() {
    const port = this.configService.get<number>('PORT');
    return `port number is ${port}`;
  }

  //testing the query params, headers, redirect, response and request objects

  @Get()
  @Header('Cache-Control', 'no-cache')
  getHello(@Query('name') name: string): string {
    console.log(`Received request with name: ${name}`);
    return 'Hello, ' + name + '!';
  }
  @Get('test')
  @Header('Authorization', 'Bearer <token>')
  @Redirect('https://docs.nestjs.com/', 302)
  getTest(): string {
    return 'Test route';
  }
  @Get('lib-spec-res')
  getLibSpecRes(@Res() res): Response {
    return res.json({ message: 'Hello from lib-spec-res route' });
  }
  @Get('id/:id')
  getById(@Param('id') id: string): string {
    return `your Id is ${id}`;
  }

  @Post('create')
  createcat(@Req() req: Request): string {
    console.log(req.body);
    return 'Item created';
  }
  @Post('param/:name')
  getname(@Param('name') name: string): string {
    return ` Your name is ${name}`;
  }
  @Post('Dto')
  createCat(@Body() creatCat: Cat): string {
    console.log(creatCat);
    return 'Cat created';
  }
}
