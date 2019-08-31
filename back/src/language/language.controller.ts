import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageDto } from './language.dto';
import Language from './language.interface';

/**
 * Classes that represent a language controller.
 * @typedef {Object} LanguageController
 */
@ApiUseTags('language')
@Controller('language')
export class LanguageController {
  /**
   * @constructs LanguageController
   * @param {LanguageService} languageService The language service instance.
   */
  constructor(private readonly languageService: LanguageService) {}

  /**
   * API to find all languages.
   * @returns {Promise<Language[]>} Promise object represents the list of languages.
   */
  @Get()
  @ApiOperation({ title: 'List all languages' })
  async findAll(): Promise<Language[]> {
    return this.languageService.findAll();
  }

  /**
   * API to find a language by it's ID.
   * @param {string} id The language id.
   * @throws {NotFoundException} A language with the given ID not exist.
   * @returns {Promise<Language>} Promise object represents the language.
   */
  @Get(':id')
  @ApiOperation({ title: 'Find a specific language' })
  async findOne(@Param('id') id: string): Promise<Language> {
    const language = this.languageService.findOne(id);

    if (!language) {
      throw new NotFoundException();
    }

    return language;
  }

  /**
   * API to create a new language.
   * @param {LanguageDto} language The new job.
   * @throws {InternalServerErrorException} If could not create the language.
   * @returns {Promise<Job>} Promise object represents the language.
   */
  @Post()
  @ApiOperation({ title: 'Create a new language' })
  async create(@Body() language: LanguageDto): Promise<Language> {
    try {
      return await this.languageService.create(language);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

}

