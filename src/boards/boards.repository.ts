import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/boards.entity';
import { CreateBoard, GetBoards } from './type/types';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectRepository(Board) private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoard: CreateBoard) {
    const board = this.boardsRepository.create(createBoard);

    return await this.boardsRepository.save(board);
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

    const createdAtUtc = new Date(board.createdAt);
    const updatedAtUtc = new Date(board.updatedAt);

    const koreaTimeOffset = 9 * 60 * 60 * 1000;

    board.createdAt = new Date(createdAtUtc.getTime() + koreaTimeOffset);
    board.updatedAt = new Date(updatedAtUtc.getTime() + koreaTimeOffset);
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
