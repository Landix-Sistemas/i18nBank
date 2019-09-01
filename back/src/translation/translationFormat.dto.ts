import {
    IsString,
    IsArray,
    IsNotEmpty,
  } from 'class-validator'; 
  import { ApiModelProperty } from '@nestjs/swagger';
  
  /**
   * Classes that represent a translation format data transfer object.
   * @typedef {Object} TranslationFormatDto
   */
  export class TranslationFormatDto {
  
    /**
     * The translation language.
     * @property {string}   language
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty() 
    language: string; 

    /**
     * The translation value.
     * @property {string}   value
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty() 
    value: string;    
  }
  