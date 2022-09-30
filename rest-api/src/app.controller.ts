import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(@Inject('SUBSCRIBERS_SERVICE') private client: ClientProxy) {}

  @Post('/')
  appPost(@Body() post: any) {
    return this.client.send({ cmd: 'createPost' }, post);
  }

  @Get('/')
  getList(@Query() dto: PaginationDto) {
    return this.client.send({ cmd: 'findAllPosts' }, dto);
  }

  @Get('one/:id')
  getOnePost(@Param('id') id: string) {
    return this.client.send({ cmd: 'findOnePost' }, id);
  }

  @Patch('/')
  updatePost(@Body() postUpdate: UpdatePostDto) {
    return this.client.send({ cmd: 'updatePost' }, postUpdate);
  }

  @Delete('del/:id')
  deletePost(@Param('id') id: string) {
    return this.client.send({ cmd: 'removePost' }, id);
  }
}
