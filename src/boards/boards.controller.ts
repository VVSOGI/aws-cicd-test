import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { v4 } from 'uuid';

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
    const id = v4();
    const userId = req.user.id;
    const email = req.user.email;
    const imagePath = await this.boardsService.uploadImage(file, userId, id);
    const board = await this.boardsService.createBoard({
      id,
      userId,
      email,
      imagePath,
      ...createBoardDto,
    });
    return board;
  }

  @Get()
  async getAllBoards(@Query('page') page = 1) {
    if (page <= 0) throw new BadRequestException('Invalid page');

    return await this.boardsService.getAllBoards({ page });
  }

  @Get('search')
  async searchAddress(@Query('keyword') keyword: string) {
    return await this.boardsService.searchAddress(keyword);
  }

  @Get('/:id/owned')
  @UseGuards(JwtAuthGuard)
  async isOwnedBoard(@Param('id') id: string, @Request() req) {
    const board = await this.boardsService.getBoardById(id);
    if (board.data.userId !== req.user.id) return false;

    return true;
  }

  @Get('/:id')
  getBoardById(@Param('id') id: string) {
    return this.boardsService.getBoardById(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(@Param('id') id: string, @Request() req) {
    const board = await this.boardsService.getBoardById(id);

    if (board.data.userId !== req.user.id)
      throw new ForbiddenException('Not owned board');

    if (board.data.imagePath)
      await this.boardsService.deleteS3Image(board.data.imagePath);

    return await this.boardsService.deleteBoard(id);
  }
}
