import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class AppController {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'posts',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'posts-rest',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('createPost');
    this.client.subscribeToResponseOf('findAllPosts');
    this.client.subscribeToResponseOf('findOnePost');
    this.client.subscribeToResponseOf('updatePost');
    this.client.subscribeToResponseOf('removePost');

    await this.client.connect();
  }

  @Post('/')
  appPost(@Body() post: any) {
    return this.client.send('createPost', post);
  }

  @Get('/')
  getList(@Query() dto: PaginationDto) {
    return this.client.send('findAllPosts', dto);
  }

  @Get('one/:id')
  getOnePost(@Param('id') id: string) {
    return this.client.send('findOnePost', id);
  }

  @Patch('/')
  updatePost(@Body() postUpdate: UpdatePostDto) {
    return this.client.send('updatePost', postUpdate);
  }

  @Delete('del/:id')
  deletePost(@Param('id') id: string) {
    return this.client.send('removePost', id);
  }
}
