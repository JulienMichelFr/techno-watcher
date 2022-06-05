import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreatePostDto, GetPostsDto, PostModel } from '@techno-watcher/api-models';

import { PostRepositoryService } from '../../repositories/post/post-repository.service';

import { PostService } from './post.service';

describe('PostService', () => {
  let postRepository: PostRepositoryService;
  let service: PostService;

  beforeEach(async () => {
    postRepository = {
      findById: jest.fn(),
      findPaginated: jest.fn(),
      create: jest.fn(),
      softDeleteById: jest.fn(),
    } as unknown as PostRepositoryService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PostRepositoryService, useValue: postRepository }, PostService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById()', () => {
    it('should call correct method on repository', async () => {
      await service.findById(1);
      expect(postRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('find()', () => {
    it('should call correct method on repository', async () => {
      const getPostsDto: GetPostsDto = {
        skip: 0,
        sort: 'createdAt:asc',
        tags: [],
        take: 10,
      };
      await service.find(getPostsDto);
      expect(postRepository.findPaginated).toHaveBeenCalledWith(getPostsDto);
    });
  });

  describe('create()', () => {
    it('should call correct method on repository', async () => {
      const createPostDto: CreatePostDto = {
        content: '',
        link: '',
        tags: [],
        title: '',
      };
      const userId: number = 1;
      await service.create(createPostDto, userId);
      expect(postRepository.create).toHaveBeenCalledWith(createPostDto, userId);
    });
  });

  describe('softDeleteById()', () => {
    let postId: number;
    let userId: number;
    let post: PostModel;

    beforeEach(() => {
      postId = 1;
      userId = 1;
      post = {
        id: postId,
        author: {
          id: userId,
        },
      } as PostModel;

      (postRepository.findById as jest.Mock).mockResolvedValue(post);
    });

    it('should call correct method on repository', async () => {
      await service.softDeleteById(postId, userId);
      expect(postRepository.softDeleteById).toHaveBeenCalledWith(postId);
    });

    it('should get post before deleting', async () => {
      await service.softDeleteById(postId, userId);
      expect(postRepository.findById).toHaveBeenCalledWith(postId);
    });

    it('should throw an error if user is not the author', async () => {
      post.author.id = 2;
      await expect(service.softDeleteById(postId, userId)).rejects.toThrowError(new ForbiddenException('You are not allowed to delete this post'));
    });
  });
});
