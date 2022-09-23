import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddPosts, CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly repPosts: Repository<Posts>,
  ) {}

  async addPosts(posts: AddPosts[]) {
    try {
      let promises: Array<Promise<Posts | undefined>> = [];
      for (const post of posts) {
        promises.push(
          this.repPosts.findOne({
            where: { url: post.url, previewImg: post.previewImg },
          }),
        );
      }

      const oldPosts = await Promise.all(promises);
      const newPosts = posts.map((post) => {
        const oldPost = oldPosts.find((item) => item?.url === post.url);
        if (!oldPost) {
          return post;
        }
      });

      promises = [];
      for (const post of newPosts) {
        if (post) promises.push(this.repPosts.save(post));
      }

      const dbPosts = await Promise.all(promises);
      return { message: `Add ${dbPosts.length} posts` };
    } catch (err) {
      if (err instanceof HttpException) return err;
      return new InternalServerErrorException();
    }
  }

  async create(createPostDto: CreatePostDto) {
    try {
      await this.repPosts.save({
        ...createPostDto,
        date: new Date(),
      });
      return { message: 'Add post!' };
    } catch (err) {
      return new InternalServerErrorException();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      return await this.repPosts
        .createQueryBuilder('posts')
        .select()
        .orderBy('posts.date', 'DESC')
        .take(paginationDto.take)
        .skip(paginationDto.skip)
        .getMany();
    } catch (err) {
      return new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.repPosts.findOne({ where: { id } });

      if (!post) {
        throw new NotFoundException();
      }

      return { ...post };
    } catch (err) {
      if (err instanceof HttpException) return err;
      return new InternalServerErrorException();
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.repPosts.findOne({ where: { id } });

      if (!post) {
        throw new NotFoundException();
      }

      return await this.repPosts.save(updatePostDto);
    } catch (err) {
      if (err instanceof HttpException) return err;
      return new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const post = await this.repPosts.findOne({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException();
      }
      const del = await this.repPosts.delete(id);

      if (del.affected) {
        return { message: 'Remove post!!' };
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return error;
      }
      return new InternalServerErrorException();
    }
  }
}
