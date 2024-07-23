import { Injectable } from '@nestjs/common';
import {
  GetBoards,
  ServiceCreateBoard,
  ServiceUpdateBoard,
} from './type/types';
import { Board } from './entities/boards.entity';
import { BoardsRepository } from './boards.repository';
import { AuthService } from 'src/auth/auth.service';
import { ArrayException } from 'src/common/utils/arrays';
import { s3 } from 'src/common/aws/s3';
import { v4 } from 'uuid';

@Injectable()
export class BoardsService {
  constructor(
    private boardsRepository: BoardsRepository,
    private authService: AuthService,
  ) {}

  private async addUserProfile(board: Board) {
    const profile = await this.authService.profile(board.userId);
    return {
      ...board,
      profileUrl: profile.profileImage,
      nickname: profile.nickname,
    };
  }

  private async addURLtoImage(board: Board) {
    const imageUrl = `${process.env.AWS_CLOUD_FRONT_URL}${board.imagePath}`;
    return {
      ...board,
      image: imageUrl,
    };
  }

  async addAddtionalData(board: Board) {
    const addURLtoImage = await this.addURLtoImage(board);
    const addUserProfile = await this.addUserProfile(addURLtoImage);
    return addUserProfile;
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
    boardId: string,
  ): Promise<string> {
    if (!file) return 'default-image.png';
    const imageId = v4();
    const filenames = file.originalname.split('.');
    const extension = filenames[filenames.length - 1];
    const imagePath = `uploads/${userId}/${boardId}/${imageId}.${extension}`;
    await this.uploadImageToS3(imagePath, file.buffer);
    return imagePath;
  }

  /**
   * 프론트 측에서 element가 하나인 activityDate, activityTime를 보낼 때,
   * 문자열 타입으로 들어오는데 이를 프론트에서 해결할 수 없어서 서버에서 처리함
   * */
  async createBoard(createBoard: ServiceCreateBoard) {
    const id = v4();
    const { userId, file } = createBoard;
    const imagePath = await this.uploadImage(file, userId, id);
    createBoard.activityDate = ArrayException(createBoard.activityDate);
    createBoard.activityTime = ArrayException(createBoard.activityTime);

    await this.boardsRepository.create({
      id,
      imagePath,
      ...createBoard,
    });
  }

  async updateBoard(updateBoard: ServiceUpdateBoard) {
    const { userId, file } = updateBoard;
    const findBoard = await this.getBoardById(updateBoard.id);
    const addURLtoImage = await this.addURLtoImage(findBoard);
    const addUserProfile = await this.addUserProfile(addURLtoImage);
    updateBoard.activityDate = ArrayException(updateBoard.activityDate);
    updateBoard.activityTime = ArrayException(updateBoard.activityTime);

    if (!file) {
      return await this.boardsRepository.update({
        userId: addUserProfile.userId,
        email: addUserProfile.email,
        imagePath: addUserProfile.imagePath,
        ...updateBoard,
      });
    }

    const beforeImagePath = findBoard.imagePath;
    if (beforeImagePath) await this.deleteS3Image(beforeImagePath);
    const newImagePath = await this.uploadImage(file, userId, updateBoard.id);

    await this.boardsRepository.update({
      imagePath: newImagePath,
      ...updateBoard,
    });
  }

  async getAllBoards(getBoards: GetBoards) {
    const { data, total } = await this.boardsRepository.getAllBoards(getBoards);
    const boards = await Promise.all(
      data.map(async (board) => {
        const addURLtoImage = await this.addURLtoImage(board);
        const addUserProfile = await this.addUserProfile(addURLtoImage);
        return addUserProfile;
      }),
    );
    return { data: boards, total };
  }

  async getBoardById(id: string) {
    const findBoard = await this.boardsRepository.getBoardById(id);
    return findBoard;
  }

  async searchAddress(keyword: string) {
    const data = await this.boardsRepository.searchAddress(keyword);
    const boards = await Promise.all(
      data.map(async (board) => {
        const addURLtoImage = await this.addURLtoImage(board);
        const addUserProfile = await this.addUserProfile(addURLtoImage);
        return addUserProfile;
      }),
    );
    return {
      data: boards,
    };
  }

  async deleteS3Image(imagePath: string) {
    if (imagePath === 'default-image.png') return;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imagePath,
    };

    await s3.deleteObject(params).promise();
  }

  async deleteBoard(boardId: string) {
    await this.boardsRepository.deleteBoard(boardId);
  }
}
