import { Injectable } from '@nestjs/common';
import Language from './language.interface'; 

var nano = require('nano')('http://localhost:5984');
var db_name = "language";
var db = nano.use(db_name);

/**
 * Classes that represent a language service.
 * @typedef {Object} LanguageService
 */
@Injectable()
export class LanguageService {
  private languages: Language[] = [];

  /**
   * @constructs LanguageService
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
        console.log("nao existe language")
        nano.db.create(db_name).then((body) => {
            db.list({include_docs: true}).then((body) => {
                body.rows.forEach((doc) => {
                  this.languages.push(doc.doc);
                });
            });
          }) 
      }
      else {
        console.log("ja existe language")
        db.list({include_docs: true}).then((body) => {
          body.rows.forEach((doc) => {
            this.languages.push(doc.doc);
          });
        });
     }
    });
  }

  /**
   * Find all languages.
   * @returns {Language[]} List of languages.
   */
  findAll(): Language[] {
    return this.languages;
  }

  /**
   * Find a language by it's ID.
   * @param {string} id The language id.
   * @returns {Language} The language.
   */
  findOne(id: string): Language {
    return (this.languages.filter(language => language._id === id)[0] as object) as Language;
  }

  /**
   * Create a new language.
   * @param {LanguageDto} language The new language.
   * @throws {Error} If could not save.
   * @returns {Promise<Language>} Promise object represents the language.
   */
  async create(language: Language): Promise<Language> {
    await db.insert(language).then((body) => {
      const keys = [body.id];
      db.fetch({keys: keys}).then((data) => {
         this.languages.push(data.rows[0].doc)
      });
    })
    return language;
  }
  
}

