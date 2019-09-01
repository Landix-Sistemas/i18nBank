import {
    IsString,
    IsArray,
    ValidateNested,
    IsNotEmpty,
    IsDefined,
  } from 'class-validator';
  import { TranslationFormatDto } from './translationFormat.dto';
  import { Type } from 'class-transformer';
  import { ApiModelProperty } from '@nestjs/swagger';

  /**
   * Classes that represent a translation data transfer object.
   * @typedef {Object} TranslationDto
   */
  export class TranslationDto {
  
    /**
     * The translation id.
     * @property {string}   _id
     */
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    _id: string; 

    /**
     * The translation objects.
     * @property {TranslationFormatDto[]}   translations
     */
    @ApiModelProperty()
    @IsArray()
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => TranslationFormatDto)
    @IsNotEmpty()
    //translations: [TranslationFormatDto];
   // translations: object[];
   translations: TranslationFormatDto[];
  //translations: [{value:string, language:string}];
  //translations: TagDto[];
   // translations: Array<TranslationFormatDto>;
  }

  //export default TranslationDto; // emilia coloquei apagar

  /*class TagDto {
    readonly name: string;
    readonly valor: string;
} */
  