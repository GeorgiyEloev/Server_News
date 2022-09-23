import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostsService } from './posts.service';
import { CreatePostDto, AddPosts } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern('addPosts')
  addPosts(@Payload() posts: AddPosts[]) {
    return this.postsService.addPosts(posts);
  }

  @MessagePattern('createPost')
  create(@Payload() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @MessagePattern('findAllPosts')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  @MessagePattern('findOnePost')
  findOne(@Payload() id: string) {
    return this.postsService.findOne(id);
  }

  @MessagePattern('updatePost')
  update(@Payload() updatePostDto: UpdatePostDto) {
    return this.postsService.update(updatePostDto.id, updatePostDto);
  }

  @MessagePattern('removePost')
  remove(@Payload() id: string) {
    return this.postsService.remove(id);
  }
}
