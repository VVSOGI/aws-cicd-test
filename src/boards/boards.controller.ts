import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async createBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBoardDto: CreateBoardDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    const imagePath = await this.boardsService.uploadImage(file, userId);
    const board = await this.boardsService.createBoard({
      ...createBoardDto,
      userId,
      imagePath,
    });
    return board;
  }

  @Get()
  async getAllBoards(@Query('page') page = 1) {
    if (page <= 0) {
      throw new BadRequestException('Invalid page');
    }

    return await this.boardsService.getAllBoards({ page });
  }

  @Get('search')
  async searchAddress(@Query('keyword') keyword: string) {
    return await this.boardsService.searchAddress(keyword);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: string) {
    return this.boardsService.getBoardById(id);
  }
}
