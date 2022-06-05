import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';

import { PostRepositoryService } from '../../repositories/post/post-repository.service';

@Injectable()
export class PostService {
  public constructor(private postRepository: PostRepositoryService) {}

  public async findById(postId: number): Promise<PostModel> {
    return this.postRepository.findById(postId);
  }

  public async find(getPostsDto: GetPostsDto): Promise<Paginated<PostModel>> {
    return this.postRepository.findPaginated(getPostsDto);
  }

  public async create(createPostDto: CreatePostDto, userId: number): Promise<PostModel> {
    return this.postRepository.create(createPostDto, userId);
  }

  public async softDeleteById(postId: number, userId: number): Promise<void> {
    const post: PostModel = await this.findById(postId);

    if (post.author.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    await this.postRepository.softDeleteById(postId);
  }
}
