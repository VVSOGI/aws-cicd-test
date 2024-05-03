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
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBoardDto } from './dto/create-board.dto';
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
    const userId = req.user.id;
    const imageId = v4();
    if (file) {
      const filenames = file.originalname.split('.');
      const extension = filenames[filenames.length - 1];
      const imagePath = `uploads/${userId}/${imageId}.${extension}`;

      await this.boardsService.uploadImageToS3(imagePath, file.buffer);
      const board = await this.boardsService.createBoard({
        ...createBoardDto,
        userId,
        imagePath,
      });
      return board;
    }

    const imagePath = '';
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

  @Get('/:id')
  getBoardById(@Param('id') id: string) {
    return this.boardsService.getBoardById(id);
  }
}
