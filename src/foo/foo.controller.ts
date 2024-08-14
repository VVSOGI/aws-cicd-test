import { Controller, Get } from '@nestjs/common';

@Controller('foo')
export class FooController {
  @Get()
  getFoo(): string {
    return 'John Doe Test Auto Deploy 2';
  }
}
