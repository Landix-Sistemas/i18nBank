import { Module } from '@nestjs/common';
import { LanguageModule } from './language/language.module';
import { TranslationModule } from './translation/translation.module';
import { WatsonModule } from './watson/watson.module';

@Module({
  imports: [LanguageModule, TranslationModule, WatsonModule]
})
export class AppModule {}

