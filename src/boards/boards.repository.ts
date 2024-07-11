import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/boards.entity';
import { CreateBoard, GetBoards, UpdateBoard } from './type/types';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectRepository(Board) private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoard: CreateBoard) {
    const board = this.boardsRepository.create(createBoard);

    return await this.boardsRepository.save(board);
  }

  async update(updateBoard: UpdateBoard) {
    const board = await this.boardsRepository.findOneBy({ id: updateBoard.id });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const updatedBoard = { ...board, ...updateBoard };
    return await this.boardsRepository.save(updatedBoard);
  }

  async getAllBoards({ page }: GetBoards) {
    const [data, total] = await this.boardsRepository.findAndCount({
      take: 30,
      skip: 30 * (page - 1),
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      total,
    };
  }

  async getBoardById(id: string) {
    const board = await this.boardsRepository.findOneBy({ id });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async searchAddress(keyword: string) {
    return await this.boardsRepository
      .createQueryBuilder('board')
      .where('board.address LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async deleteBoard(boardId: string) {
    return await this.boardsRepository.delete({ id: boardId });
  }
}
