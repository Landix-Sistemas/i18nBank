import { Module } from '@nestjs/common';
import { LanguageModule } from './language/language.module';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [LanguageModule, TranslationModule]
})
export class AppModule {}

