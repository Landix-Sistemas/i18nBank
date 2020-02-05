import {
    IsString,
    IsNotEmpty,
  } from 'class-validator';
  import { ApiModelProperty } from '@nestjs/swagger';
  
  /**
   * Classes that represent a Watson data transfer object.
   * @typedef {Object} WatsonDto
   */
  export class WatsonDto {
  
    /**
     * The text.
     * @property {string}   _text
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    _text: string; 

    /**
     * The source language.
     * @property {string}   _source
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    readonly _source: string;

    /**
     * The target language.
     * @property {string}   _target
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    readonly _target: string;

  }
  