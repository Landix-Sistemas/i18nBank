import { Injectable } from '@nestjs/common';
import Translation from './translation.interface'; 
//import TranslationDto from './translation.dto';

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
    console.log("constru trans")
    let exist = false
    nano.db.list().then((body) => {
     body.forEach((db) => {
       console.log("existe: " + db)
        if (db == db_name)
        {
          console.log("3")
          exist2 = true;
        }
      });
      if (!exist){
        console.log("cria translation")
        nano.db.create(db_name).then((body) => {
            db.list({include_docs: true}).then((body) => {
                body.rows.forEach((doc) => {
                  this.translations.push(doc.doc);
                });
            });
          }) 
      }
      else {
        console.log("ja existe translation")
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
    //async create(translation: TranslationDto): Promise<Translation> {
    await db.insert(translation).then((body) => {
      const keys = [body.id];
      db.fetch({keys: keys}).then((data) => {
         this.translations.push(data.rows[0].doc)
      });
    })
    return translation;
  }
  
}

