/**
 * Interface for classes that represent a language.
 * @typedef {Object} Language
 * @interface
 */
interface Language {
  /**
   * The language ID.
   * @property {string}   _id
   */
  //_id?: string;
  _id: string;

  /**
   * The language revision.
   * @readonly
   * @property {string}   _rev
   */
  readonly _rev?: string;

  /**
   * The language label.
   * @property {string}   label
   */
  label: string;
}

export default Language;
