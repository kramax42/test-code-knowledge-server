import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { CategoryValidationPipe } from 'src/libs/pipes/category-validation.pipe';
import { IdValidationPipe } from 'src/libs/pipes/id-validation.pipe';
import { PaginationParamsDto } from 'src/libs/utils/pagination-params';
import { Role } from 'src/models/user.model';
import { JwtAuthGuard } from '../../libs/guards/jwt.guard';
import { CreateSnippetDto, UpdateSnippetDto } from '../../dtos/snippet.dto';
import { SNIPPET_NOT_FOUND_ERROR } from './snippets.constants';
import { SnippetsService } from './snippets.service';
import { QueryBus } from '@nestjs/cqrs';
import { GetHeroesQuery, GetSnippetsQuery } from './queries/impl';
import { CategoriesService } from '../categories/categories.service';

@Controller('snippets')
export class SnippetsController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly snippetsService: SnippetsService,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('test')
  async test() {
    return this.queryBus.execute(new GetHeroesQuery());
  }

  @Get(':category')
  async findAll(
    @Param('category', CategoryValidationPipe) category: string,
    @Query() { skip, limit }: PaginationParamsDto,
  ) {
    return this.queryBus.execute(new GetSnippetsQuery(category, skip, limit));
  }

  @Get()
  async getCategoriesSizes() {
    const sizes =
      await this.categoriesService.findAllCategoriesBySnippetsSizes();

    if (!sizes) {
      throw new NotFoundException(SNIPPET_NOT_FOUND_ERROR);
    }

    return sizes;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() dto: CreateSnippetDto) {
    const createdSnippet = await this.snippetsService.create(dto);

    return createdSnippet;
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const snippet = await this.snippetsService.findById(id);
    if (!snippet) {
      throw new NotFoundException(SNIPPET_NOT_FOUND_ERROR);
    }

    return snippet;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedSnippet = await this.snippetsService.deleteById(id);
    if (!deletedSnippet) {
      throw new NotFoundException(SNIPPET_NOT_FOUND_ERROR);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateSnippetDto,
  ) {
    const updatedSnippet = await this.snippetsService.updateById(id, dto);
    if (!updatedSnippet) {
      throw new NotFoundException(SNIPPET_NOT_FOUND_ERROR);
    }
    return updatedSnippet;
  }
}
