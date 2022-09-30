import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(
    private readonly postsService: AppService,
    @Inject('SUBSCRIBERS_SERVICE') private client: ClientProxy,
  ) {}

  @Get()
  async addPosts() {
    const posts = await this.postsService.addPosts();
    return this.client.send({ cmd: 'addPosts' }, posts);
  }
}
