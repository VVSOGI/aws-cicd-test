import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardsService } from '../boards.service';

@Injectable()
export class BoardExistsGuard implements CanActivate {
  constructor(private readonly boardsService: BoardsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const boardId = request.query.id || request.params.id;

    const boardExists = await this.boardsService.getBoardById(boardId);

    if (!boardExists) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }

    return true;
  }
}
