import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);

    // user.isAdmin은 사용자가 관리자인지를 나타내는 프로퍼티라고 가정
    // return user && user.isAdmin;
    return true;
  }
}
