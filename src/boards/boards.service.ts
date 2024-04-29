import { Injectable } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { GetBoards } from './type/types';

@Injectable()
export class BoardsService {
  constructor(private boardsRepository: BoardsRepository) {}

  async createBoard() {}

  getAllBoards(getBoards: GetBoards) {
    return this.boardsRepository.getAllBoards(getBoards);
  }

  getBoardById(id: string) {
    return this.boardsRepository.getBoardById(id);
  }
}
