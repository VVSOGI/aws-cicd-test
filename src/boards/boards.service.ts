import { Injectable } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { AuthService } from 'src/auth/auth.service';
import { CreateBoard, GetBoards } from './type/types';
import { s3 } from 'src/common/aws/s3';
import { v4 } from 'uuid';

@Injectable()
export class BoardsService {
  constructor(
    private boardsRepository: BoardsRepository,
    private authService: AuthService,
  ) {}
  /**
   * 프론트 측에서 element가 하나인 activityDate, activityTime를 보낼 때,
   * 문자열 타입으로 들어오는데 이를 프론트에서 해결할 수 없어서 서버에서 처리함
   * */
  async createBoard(createBoard: CreateBoard) {
    const user = await this.authService.profile(createBoard.userId);

    if (!Array.isArray(createBoard.activityDate)) {
      createBoard.activityDate = [createBoard.activityDate];
    }

    if (!Array.isArray(createBoard.activityTime)) {
      createBoard.activityTime = [createBoard.activityTime];
    }

    this.boardsRepository.create({
      ...createBoard,
      email: user.email,
    });
  }

  async getAllBoards(getBoards: GetBoards) {
    const { data, total } = await this.boardsRepository.getAllBoards(getBoards);
    const addImageBoards = data.map((board) => {
      if (!board.imagePath) {
        return board;
      }
      const image = process.env.AWS_S3_URL + board.imagePath;
      return {
        ...board,
        image: image,
      };
    });
    return { data: addImageBoards, total };
  }

  async getBoardById(id: string) {
    const board = await this.boardsRepository.getBoardById(id);
    const profile = await this.authService.profile(board.userId);
    const image = process.env.AWS_S3_URL + board.imagePath;

    if (!board.imagePath) {
      return {
        data: {
          ...board,
          nickname: profile.nickname,
        },
      };
    }

    return {
      data: {
        ...board,
        nickname: profile.nickname,
        image: image,
      },
    };
  }

  private async uploadImageToS3(imagePath: string, imageBuffer: Buffer) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imagePath,
      Body: imageBuffer,
    };

    await s3.upload(params).promise();
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    if (!file) {
      return '';
    }
    const imageId = v4();
    const filenames = file.originalname.split('.');
    const extension = filenames[filenames.length - 1];
    const imagePath = `uploads/${userId}/${imageId}.${extension}`;
    await this.uploadImageToS3(imagePath, file.buffer);
    return imagePath;
  }

  async searchAddress(keyword: string) {
    const data = await this.boardsRepository.searchAddress(keyword);
    const addImageBoards = data.map((board) => {
      if (!board.imagePath) {
        return board;
      }
      const image = process.env.AWS_S3_URL + board.imagePath;
      return {
        ...board,
        image: image,
      };
    });
    return {
      data: addImageBoards,
    };
  }
}
