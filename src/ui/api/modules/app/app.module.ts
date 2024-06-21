import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { DatabaseModule } from '../database/database.module';
import { SettingsModule } from '../settings/settings.module';
import { AppLoggerMiddleware } from '../shared/middlewares/logger-middleware';

@Module({
  imports: [SettingsModule.forRoot(), DatabaseModule, CategoriesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
