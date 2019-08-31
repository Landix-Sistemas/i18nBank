import {
    IsString,
    IsEnum,
    IsArray,
    IsNotEmpty,
    ValidateIf,
  } from 'class-validator';
  import { ApiModelProperty } from '@nestjs/swagger';
  
  /**
   * Classes that represent a language data transfer object.
   * @typedef {Object} LanguageDto
   */
  export class LanguageDto {
  
    /**
     * The language id.
     * @property {string}   _id
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    _id: string; 

    /**
     * The language label.
     * @property {string}   label
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    readonly label: string;
  }
  