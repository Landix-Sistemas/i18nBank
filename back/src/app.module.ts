import { Module } from '@nestjs/common';
import { LanguageModule } from './language/language.module';
import { TranslationController } from './translation/translation.controller';
import { TranslationService } from './translation/translation.service';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [LanguageModule, TranslationModule],
  providers: [TranslationService],
  controllers: [TranslationController],
})
export class AppModule {}

