import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { PolicyDto } from '../policy/dto/policy.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

@Controller('/')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }


  @Get('api/user/news')
  async getListU(): Promise<BaseSearchResponse<NewsDto>> {
    return await this.newsService.getListU()
  }

  @Post('api/news/list-news')
  async getList(@Body() input: BaseSearchInput): Promise<BaseSearchResponse<NewsDto>> {
    return await this.newsService.getList(input)
  }

  @Post('api/news/create-news')
  create(@Body() createDepartmentDto: CreateNewsDto) {
    return this.newsService.create(createDepartmentDto);
  }


  @Put('api/news/update-news/:id')
  async update(@Body() input: CreateNewsDto, @Param('id') id: string): Promise<string> {
    return await this.newsService.update(input, id)
  }

  @Delete('api/news/delete-news/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.newsService.delete(id)
  }

}
