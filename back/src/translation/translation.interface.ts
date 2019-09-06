import { TranslationFormatDto } from './translationFormat.dto';
/**
 * Interface for classes that represent a translation.
 * @typedef {Object} Translation
 * @interface
 */
interface Translation {
 // class Translation {
    /**
     * The translation ID.
     * @property {string}   _id
     */
    //_id?: string;
    _id: string;
  
    /**
     * The translation revision.
     * @readonly
     * @property {string}   _rev
     */
    readonly _rev?: string;
  
    /**
     * The translation object.
     * @property {array}   translations
     */
    translations: TranslationFormatDto[];
  }
  
  export default Translation;
  