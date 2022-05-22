import { PrismaService } from '../../../prisma/prisma.service';
import { PostService } from './post.service';
import { Post, Prisma } from '@prisma/client';
import { Paginated } from '@techno-watcher/api-models';

describe('PostService', () => {
  let prismaService: PrismaService;
  let postService: PostService;

  beforeEach(() => {
    prismaService = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $transaction: jest.fn(),
      post: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      } as unknown as PrismaService,
    } as unknown as PrismaService;

    postService = new PostService(prismaService);
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2022, 1, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('count()', () => {
    it('should call prisma service with correct args', async () => {
      const conditions: Prisma.PostCountArgs = {
        where: {
          deletedAt: null,
        },
      };
      await postService.count(conditions);
      expect(prismaService.post.count).toHaveBeenCalledWith(conditions);
    });
  });

  describe('findOne()', () => {
    it('should call prisma service with correct args', async () => {
      const conditions: Prisma.PostFindUniqueArgs = {
        where: {
          id: 1,
        },
      };
      await postService.findOne(conditions);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith(conditions);
    });
  });

  describe('find()', () => {
    let conditions: Prisma.PostFindManyArgs;
    let response: Post[];

    beforeEach(() => {
      conditions = {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
        },
      };

      response = [{ id: 1 } as Post];

      (prismaService.post.findMany as jest.Mock).mockResolvedValue(response);
      (prismaService.$transaction as jest.Mock).mockResolvedValue([response.length, response]);
    });

    afterEach(() => {
      (prismaService.post.findMany as jest.Mock).mockClear();
    });

    it('should call prisma service with correct args', async () => {
      await postService.find(conditions, false);
      expect(prismaService.post.findMany).toHaveBeenCalledWith(conditions);
    });

    it('should return correct response', async () => {
      const result: Post[] | Paginated<Post> = await postService.find(conditions, false);
      expect(result).toEqual(response);
    });

    it('should not call transaction and count without pagination', async () => {
      await postService.find(conditions, false);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
      expect(prismaService.post.count).not.toHaveBeenCalled();
    });

    it('should call transaction and count without pagination', async () => {
      await postService.find(conditions, true);
      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(prismaService.post.count).toHaveBeenCalledWith({ where: conditions.where });
    });

    it('should return correct response with pagination', async () => {
      const result: Post[] | Paginated<Post> = await postService.find(conditions, true);
      expect(result).toEqual({
        total: 1,
        from: 0,
        to: 10,
        data: response,
        perPage: 10,
      });
    });
  });

  describe('create()', () => {
    let postCreateInput: Prisma.PostCreateInput;

    beforeEach(() => {
      postCreateInput = {
        title: 'title',
      } as Prisma.PostCreateInput;
    });

    it('should call prisma service with correct args', async () => {
      await postService.create(postCreateInput);
      expect(prismaService.post.create).toHaveBeenCalledWith({ data: postCreateInput });
    });

    it('should add extra args', async () => {
      await postService.create(postCreateInput, { select: { id: true } });
      expect(prismaService.post.create).toHaveBeenCalledWith({ data: postCreateInput, select: { id: true } });
    });
  });

  describe('softDeleteById()', () => {
    it('should call prisma service with correct args', async () => {
      await postService.softDeleteById(1);
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: new Date() },
      });
    });
  });
});
