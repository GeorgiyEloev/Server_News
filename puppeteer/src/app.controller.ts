import { Controller, Get } from '@nestjs/common';
import {
  Client,
  ClientKafka,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly postsService: AppService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'posts',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'posts-pup',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('addPosts');

    await this.client.connect();
  }

  @Get()
  async addPosts() {
    const posts = await this.postsService.addPosts();
    return this.client.send('addPosts', posts);
  }
}
