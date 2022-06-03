import { Test, TestingModule } from '@nestjs/testing';
import { PostAndSelect, PostRepositoryService } from './post-repository.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthorModel, CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';

describe('PostRepositoryService', () => {
  let prismaService: PrismaService;
  let service: PostRepositoryService;
  let postAndSelect: PostAndSelect;

  beforeEach(async () => {
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
      providers: [{ provide: PrismaService, useValue: prismaService }, PostRepositoryService],
    }).compile();

    service = module.get<PostRepositoryService>(PostRepositoryService);
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
      await service.findById(1);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: service.postSelect,
      });
    });

    it('should map response to PostModel', async () => {
      const result: PostModel = await service.findById(1);
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
        select: service.postSelect,
        skip: 0,
        take: 10,
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
            hasSome: ['tag1', 'tag2'],
          },
        },
        select: service.postSelect,
        skip: 0,
        take: 10,
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
        select: service.postSelect,
      });
    });
  });

  describe('softDeleteById()', () => {
    it('should call prisma service with correct args', async () => {
      await service.softDeleteById(1);
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: new Date() },
      });
    });
  });
});
