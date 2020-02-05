/**
 * Interface for classes that represent a Watson.
 * @typedef {Object} Watson
 * @interface
 */
interface Watson {
  /**
   * The text.
   * @property {string}   _text
   */
  //_text?: string;
  _text: string;

  /**
   * The source language.
   * @readonly
   * @property {string}   _source
   */
  readonly _source?: string;

  /**
   * The target language.
   * @property {string}   _target
   */
  target: string;
}

export default Watson;
