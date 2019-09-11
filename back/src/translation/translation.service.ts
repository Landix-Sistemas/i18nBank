import { Injectable } from '@nestjs/common';
import Translation from './translation.interface'; 

var nano = require('nano')('http://localhost:5984');
var db_name = "translation";
var db = nano.use(db_name);

/**
 * Classes that represent a translation service.
 * @typedef {Object} TranslationService
 */
@Injectable()
export class TranslationService {
  private translations: Translation[] = [];

  /**
   * @constructs TranslationService
   */
  constructor() {
    let exist = false
    nano.db.list().then((body) => {
     body.forEach((db) => {
        if (db == db_name)
        {
          exist = true;
        }
      });
      if (!exist){
        nano.db.create(db_name).then((body) => {
            db.list({include_docs: true}).then((body) => {
                body.rows.forEach((doc) => {
                  this.translations.push(doc.doc);
                });
            });
          }) 
      }
      else {
        db.list({include_docs: true}).then((body) => {
          body.rows.forEach((doc) => {
            this.translations.push(doc.doc);
          });
        });
     }
    });
  }

  /**
   * Find all translations.
   * @returns {Translation[]} List of translations.
   */
  findAll(): Translation[] {
    return this.translations;
  }

  /**
   * Find a translation by it's ID.
   * @param {string} id The translation id.
   * @returns {Translation} The translation.
   */
  findOne(id: string): Translation {
    return (this.translations.filter(translation => translation._id === id)[0] as object) as Translation;
  }

  /**
   * Create a new translation.
   * @param {TranslationDto} translation The new translation.
   * @throws {Error} If could not save.
   * @returns {Promise<Translation>} Promise object represents the translation.
   */
  async create(translation: Translation): Promise<Translation> {
    await db.insert(translation).then((body) => {
      const keys = [body.id];
      db.fetch({keys: keys}).then((data) => {
         this.translations.push(data.rows[0].doc)
      });
    })
    return translation;
  }

  /**
   * Update a translation.
   * @param {string} id The translation id.
   * @param {string} language The translation language.
   * @param {string} value The translation value.
   * @throws {Error} If could not update the translation or could not save the json file.
   */
  async update(id: string, language: string, value: string) {
    const transIndex = this.translations.findIndex(item => item._id === id);

    if (transIndex < 0) {
      throw new Error('Translation not found');
    }

    this.translations.splice(transIndex, 1);

    db.list({include_docs: true,'key': id}).then((body) => {
      (body.rows[0].doc.translations.filter(translation => translation.language === language)[0]).value = value
      db.insert({ _id: id, _rev: body.rows[0].doc._rev, translations: body.rows[0].doc.translations }).then((body) => {
         const keys = [body.id];
         db.fetch({keys: keys}).then((data) => {
         this.translations.push(data.rows[0].doc)
      });
      })
    });
  }
  
}

