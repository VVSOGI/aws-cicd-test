import { Injectable } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { GetBoards } from './type/types';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthService } from 'src/auth/auth.service';
import { s3 } from 'src/common/aws/s3';

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

  async uploadImageToS3(imagePath: string, imageBuffer: Buffer) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imagePath,
      Body: imageBuffer,
    };

    await s3.upload(params).promise();
  }

  async createBoard(createBoardDto: CreateBoard) {
    const user = await this.authService.profile(createBoardDto.userId);
    this.boardsRepository.create({
      ...createBoardDto,
      email: user.email,
    });
  }

  async getAllBoards(getBoards: GetBoards) {
    const { data, total } = await this.boardsRepository.getAllBoards(getBoards);
    const addImageBoards = data.map((board) => {
      const image = process.env.AWS_S3_URL + board.imagePath;
      return {
        ...board,
        image: image,
      };
    });
    return { data: addImageBoards, total };
  }

  getBoardById(id: string) {
    return this.boardsRepository.getBoardById(id);
  }
}
