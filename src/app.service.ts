import { Injectable } from '@nestjs/common';
import { Cat } from './app.controller';

@Injectable()
export class AppService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }
  getAll() {
    return this.cats;
  }
}
