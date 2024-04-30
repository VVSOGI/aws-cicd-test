import { Injectable } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { GetBoards } from './type/types';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthService } from 'src/auth/auth.service';

interface CreateBoard extends CreateBoardDto {
  userId: string;
  imagePath: string;
}

@Injectable()
export class BoardsService {
  constructor(
    private boardsRepository: BoardsRepository,
    private authService: AuthService,
  ) {}

  async createBoard(createBoardDto: CreateBoard) {
    const { userId, title, description, imagePath } = createBoardDto;

    const user = await this.authService.profile(userId);
    const { email } = user;

    this.boardsRepository.create({
      userId,
      email,
      imagePath,
      title,
      description,
    });
  }

  getAllBoards(getBoards: GetBoards) {
    return this.boardsRepository.getAllBoards(getBoards);
  }

  getBoardById(id: string) {
    return this.boardsRepository.getBoardById(id);
  }
}
