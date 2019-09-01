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
import { TranslationService } from './translation.service';
import { TranslationDto } from './translation.dto';
import { TranslationFormatDto } from './translationFormat.dto';
import Translation from './translation.interface';

/**
 * Classes that represent a translation controller.
 * @typedef {Object} TranslationController
 */
@ApiUseTags('translation')
@Controller('translation')
export class TranslationController {
  /**
   * @constructs TranslationController
   * @param {TranslationService} translationService The translation service instance.
   */
  constructor(private readonly translationService: TranslationService) {}

  /**
   * API to find all translation.
   * @returns {Promise<Translation[]>} Promise object represents the list of translations.
   */
  @Get()
  @ApiOperation({ title: 'List all translation' })
  async findAll(): Promise<Translation[]> {
    return this.translationService.findAll();
  }

  /**
   * API to find a translation by it's ID.
   * @param {string} id The translation id.
   * @throws {NotFoundException} A translation with the given ID not exist.
   * @returns {Promise<Language>} Promise object represents the translation.
   */
  @Get(':id')
  @ApiOperation({ title: 'Find a specific translation' })
  async findOne(@Param('id') id: string): Promise<Translation> {
    const translation = this.translationService.findOne(id);

    if (!translation) {
      throw new NotFoundException();
    }

    return translation;
  }

  /**
   * API to create a new translation.
   * @param {TranslationDto} translation The new translation.
   * @throws {InternalServerErrorException} If could not create the translation.
   * @returns {Promise<Job>} Promise object represents the translation.
   */
  @Post()
  @ApiOperation({ title: 'Create a new translation' })
  async create(@Body() translation: TranslationDto): Promise<Translation> {
    try {
      return await this.translationService.create(translation);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

}

