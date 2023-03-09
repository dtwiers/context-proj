import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private _db: PrismaClient;

  constructor() {
    this._db = new PrismaClient();
  }

  get db() {
    return this._db;
  }

  onApplicationBootstrap() {
    this._db.$connect();
  }

  onApplicationShutdown() {
    this._db.$disconnect();
  }
}
