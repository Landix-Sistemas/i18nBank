import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { WatsonService } from './watson.service';
import { WatsonDto } from './watson.dto';

/**
 * Classes that represent a Watson controller.
 * @typedef {Object} WatsonController
 */
@ApiUseTags('watson')
@Controller('watson')
export class WatsonController {
  /**
   * @constructs WatsonController
   * @param {WatsonService} watsonService The Watson service instance.
   */
  constructor(private readonly watsonService: WatsonService) {}

  /**
   * API to translate a text from source to target language.
   * @param {string} text The text.
   * @param {string} source The source language.
   * @param {string} target The target language.
   * @throws {InternalServerErrorException} If could not translate.
   * @returns {Promise<string>} Promise object represents the translation.
   */
  @Get(':text/:source/:target')
  @ApiOperation({ title: 'Translate to a specific language. One of the languages MUST be English' })
  async translate(@Param('text') text: string, @Param('source') source: string, @Param('target') target: string): Promise<string> {
    const watson = this.watsonService.translate(text, source, target);

    if (!watson) {
      throw new NotFoundException();
    }

    return watson;
  }

}

