import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { BoardExistsGuard } from './guards/board-exists.guard';

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
    const email = req.user.email;
    const board = await this.boardsService.createBoard({
      userId,
      email,
      file,
      ...createBoardDto,
    });
    return board;
  }

  @Patch('/:boardId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async updateBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBoardDto: UpdateBoardDto,
    @Param('boardId') boardId: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    const email = req.user.email;
    await this.boardsService.updateBoard({
      id: boardId,
      userId,
      email,
      file,
      ...updateBoardDto,
    });
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
  @UseGuards(BoardExistsGuard)
  async getBoardById(@Param('id') id: string) {
    const board = await this.boardsService.getBoardById(id);
    const addtionalBoard = await this.boardsService.addAddtionalData(board);
    return addtionalBoard;
  }

  @Delete('/:id')
  @UseGuards(BoardExistsGuard)
  @UseGuards(JwtAuthGuard)
  async deleteBoard(@Param('id') id: string, @Request() req) {
    const board = await this.boardsService.getBoardById(id);

    if (board.userId !== req.user.id) {
      throw new ForbiddenException('Not owned board');
    }

    if (board.imagePath) {
      await this.boardsService.deleteS3Image(board.imagePath);
    }

    return await this.boardsService.deleteBoard(id);
  }
}
