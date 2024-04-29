import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  createBoard() {}

  @Get()
  getAllBoards(@Query('page') page = 1) {
    if (page <= 0) {
      throw new BadRequestException('Invalid page');
    }

    return this.boardsService.getAllBoards({ page });
  }

  @Get('/:id')
  getBoardById(@Param('id') id: string) {
    return this.boardsService.getBoardById(id);
  }
}
