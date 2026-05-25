import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorator/customize';

@Controller()
export class PingController {
  @Get('ping')
  @Public()
  pingServer() {
    return { status: 'ok', message: 'Backend is awake!' };
  }
}
