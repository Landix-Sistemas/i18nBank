import { Injectable } from '@nestjs/common';

require('dotenv').config();
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');

/**
 * Classes that represent a Watson service.
 * @typedef {Object} WatsonService
 */
@Injectable()
export class WatsonService {
  //private languageTranslator
  /**
   * @constructs WatsonService
   */
 /* constructor() {
     this.languageTranslator = new LanguageTranslatorV3({
      username: process.env.LANGUAGE_TRANSLATOR_USERNAME || '<language_translator_username>',
      password: process.env.LANGUAGE_TRANSLATOR_PASSWORD || '<language_translator_password>',
      version: '2019-01-10'
      });
  }*/

  /**
   * Translate a text from source to target language. One of the languages MUST be English
   * @param {string} text The text.
   * @param {string} source The source language.
   * @param {string} target The target language.
   * @returns {string} The translation.
   */
  async translate(text: string, source: string, target: string): Promise<string> {
    const languageTranslator = new LanguageTranslatorV3({
    username: process.env.LANGUAGE_TRANSLATOR_USERNAME || '<language_translator_username>',
    password: process.env.LANGUAGE_TRANSLATOR_PASSWORD || '<language_translator_password>',
    version: '2019-01-10'
    }); 
    var result = 'error'
    // await this.languageTranslator.translate(
    await languageTranslator.translate(
      {
        text: text,
        source: source,
        target: target
      })
      .then(response => {
        result = JSON.stringify(response.result.translations[0].translation, null, 2);
      })
      .catch(err => {
        result = 'error';
      });
    return result;
  }
  
}

