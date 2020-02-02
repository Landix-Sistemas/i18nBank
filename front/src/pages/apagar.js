'use strict'
require('dotenv').config()

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3')

/**
 * Instantiate the Watson Language Translator Service
 */
const languageTranslator = new LanguageTranslatorV3({
  username: process.env.LANGUAGE_TRANSLATOR_USERNAME || '<language_translator_username>',
  password: process.env.LANGUAGE_TRANSLATOR_PASSWORD || '<language_translator_password>',
  version: '2019-01-10'
})

languageTranslator.translate(
  {
    text: 'A sentença tem que ter um verbo',
    source: 'pt',
    target: 'en-US'
  }).then(response => {
  console.log(JSON.stringify(response.result.translations[0].translation, null, 2));
}).catch(err => {
  console.log('error: ', err)
})
