import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { AssetModule } from '../domains/asset/asset.module';
import { AuthModule } from '../domains/auth/auth.module';
import { EventModule } from '../domains/event/event.module';
import { PresentationModule } from '../domains/presentation/presentation.module';
import { SlideModule } from '../domains/slide/slide.module';
import { UsersModule } from '../domains/users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    EventModule,
    SlideModule,
    AssetModule,
    PresentationModule,
    AuthModule,
    UsersModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
