import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseApp } from './firebase/firebase-app';
import { AuthMiddleware, EventMiddleware } from './config/middleware';
import { UploadService } from './constants/common/storage/google-cloud-storage.service';
import { CategorySeeder } from './constants/seeders/Categories/category.seeder';
import { BadgeSeeder } from './constants/seeders/Badges/Badges';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [
    FirebaseApp,
    CategorySeeder,
    BadgeSeeder,
    AppService,
    UploadService
  ],
  exports: [FirebaseApp, UploadService],
})
export class AppModule implements NestModule {
  constructor(
    private readonly categorySeeder: CategorySeeder,
    private readonly badgeSeeder: BadgeSeeder,
  ) {}

  async onModuleInit() {
    await this.categorySeeder.seedCategories();
    await this.badgeSeeder.seedCategories();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware, EventMiddleware).forRoutes({
      path: '/auth/*',
      method: RequestMethod.ALL,
    });
  }
}
