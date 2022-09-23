import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.create(AppModule);

  await app.listen(configService.get<number>('PORT') || 7777, () => {
    Logger.log(
      `Application running on port: ${
        configService.get<number>('PORT') || 7777
      } 🚀`,
      'Main',
    );
  });
}
bootstrap();
