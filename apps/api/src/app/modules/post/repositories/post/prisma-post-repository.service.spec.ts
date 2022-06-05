import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { AuthorModel, CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';

import { PrismaService } from '../../../prisma/prisma.service';

import { PostAndSelect, PrismaPostRepositoryService } from './prisma-post-repository.service';

describe('PrismaPostRepositoryService', () => {
  let prismaService: PrismaService;
  let service: PrismaPostRepositoryService;
  let postAndSelect: PostAndSelect;
  let postSelect: Prisma.PostSelect;
  let postId: number;

  beforeEach(async () => {
    postId = 1;

    postSelect = {
      id: true,
      title: true,
      link: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      tags: true,
      comments: false,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      _count: true,
    };

    postAndSelect = {
      id: 1,
      title: 'title',
      content: 'content',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      _count: { comments: 0 },
      tags: [],
      link: 'link',
      author: {
        id: 1,
        username: 'username',
      },
    };

    prismaService = {
      $transaction: jest.fn(),
      post: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      } as unknown as PrismaService,
    } as unknown as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: prismaService }, PrismaPostRepositoryService],
    }).compile();

    service = module.get<PrismaPostRepositoryService>(PrismaPostRepositoryService);
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2022, 1, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPostModel()', () => {
    it('should return correct PostModel', () => {
      const result: PostModel = service.createPostModel(postAndSelect);
      expect(result).toBeInstanceOf(PostModel);
      expect(result.id).toBe(postAndSelect.id);
      expect(result.title).toBe(postAndSelect.title);
      expect(result.content).toBe(postAndSelect.content);
      expect(result.createdAt).toBe(postAndSelect.createdAt);
      expect(result.updatedAt).toBe(postAndSelect.updatedAt);
      expect(result.tags).toBe(postAndSelect.tags);
      expect(result.link).toBe(postAndSelect.link);
      expect(result.totalComments).toBe(postAndSelect._count.comments);
      expect(result.author).toBeInstanceOf(AuthorModel);
      expect(result.author.id).toBe(postAndSelect.author.id);
      expect(result.author.username).toBe(postAndSelect.author.username);
    });
  });

  describe('findById()', () => {
    beforeEach(() => {
      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(postAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.findById(postId);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        select: postSelect,
      });
    });

    it('should map response to PostModel', async () => {
      const result: PostModel = await service.findById(postId);
      expect(result).toBeInstanceOf(PostModel);
    });
  });

  describe('findPaginated()', () => {
    let getPostsDto: GetPostsDto;
    let response: PostAndSelect[];

    beforeEach(() => {
      getPostsDto = {
        skip: 0,
        sort: 'createdAt:asc',
        tags: [],
        take: 10,
      };

      response = [postAndSelect];

      (prismaService.post.findMany as jest.Mock).mockResolvedValue(response);
      (prismaService.$transaction as jest.Mock).mockResolvedValue([response.length, response]);
    });

    afterEach(() => {
      (prismaService.post.findMany as jest.Mock).mockClear();
    });

    it('should call prisma service with correct args', async () => {
      await service.findPaginated(getPostsDto);
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        select: postSelect,
        skip: getPostsDto.skip,
        take: getPostsDto.take,
        orderBy: [
          {
            createdAt: 'asc',
          },
        ],
      });
    });

    it('should call prisma service with correct args when searching on tags', async () => {
      getPostsDto.tags = ['tag1', 'tag2'];
      await service.findPaginated(getPostsDto);
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          tags: {
            hasSome: getPostsDto.tags,
          },
        },
        select: postSelect,
        skip: getPostsDto.skip,
        take: getPostsDto.take,
        orderBy: [
          {
            createdAt: 'asc',
          },
        ],
      });
    });

    it('should return correct response', async () => {
      const result: Paginated<PostModel> = await service.findPaginated(getPostsDto);
      expect(result).toBeInstanceOf(Paginated);
      expect(result.data).toHaveLength(response.length);
      expect(result.data[0]).toBeInstanceOf(PostModel);
      expect(result.to).toEqual(10);
      expect(result.from).toEqual(0);
      expect(result.total).toEqual(1);
    });
  });

  describe('create()', () => {
    let createPostDto: CreatePostDto;
    let userId: number;

    beforeEach(() => {
      userId = 1;
      createPostDto = {
        content: 'content',
        link: 'link',
        title: 'title',
        tags: [],
      };

      (prismaService.post.create as jest.Mock).mockResolvedValue(postAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.create(createPostDto, userId);
      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          ...createPostDto,
          author: {
            connect: { id: userId },
          },
        },
        select: postSelect,
      });
    });
  });

  describe('softDeleteById()', () => {
    it('should call prisma service with correct args', async () => {
      await service.softDeleteById(postId);
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: { deletedAt: new Date() },
      });
    });
  });
});
