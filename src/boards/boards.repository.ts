import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entities/boards.entity';
import { GetBoards } from './type/types';

interface CreateBoard extends CreateBoardDto {
  email: string;
}

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectRepository(Board) private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoard: CreateBoard) {
    const id = v4();
    const board = this.boardsRepository.create({ id, ...createBoard });

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
    if (board) {
      const createdAtUtc = new Date(board.createdAt);
      const updatedAtUtc = new Date(board.updatedAt);

      const koreaTimeOffset = 9 * 60 * 60 * 1000;

      board.createdAt = new Date(createdAtUtc.getTime() + koreaTimeOffset);
      board.updatedAt = new Date(updatedAtUtc.getTime() + koreaTimeOffset);
    }
    return board;
  }
}
