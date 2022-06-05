import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { AddCommentOnPostDto, AuthorModel, CommentModel } from '@techno-watcher/api-models';

import { PrismaService } from '../../../prisma/prisma.service';

import { CommentAndSelect, PrismaCommentRepositoryService } from './prisma-comment-repository.service';

describe('PrismaCommentRepositoryService', () => {
  let service: PrismaCommentRepositoryService;
  let prismaService: PrismaService;
  let commentSelect: Prisma.CommentSelect;
  let commentAndSelect: CommentAndSelect;

  let postId: number;
  let userId: number;
  let parentCommentId: number;

  beforeEach(async () => {
    postId = 1;
    userId = 2;
    parentCommentId = 3;

    commentSelect = {
      id: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      content: true,
      createdAt: true,
      updatedAt: true,
      parentCommentId: true,
      deletedAt: true,
      postId: true,
    };

    commentAndSelect = {
      id: 1,
      content: 'content',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentCommentId: null,
      deletedAt: null,
      postId: 1,
      author: {
        id: 1,
        username: 'username',
      },
    };

    prismaService = {
      comment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      } as unknown as PrismaService,
    } as unknown as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaCommentRepositoryService, { provide: PrismaService, useValue: prismaService }],
    }).compile();

    service = module.get<PrismaCommentRepositoryService>(PrismaCommentRepositoryService);
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCommentModel()', () => {
    it('should return correct CommentModel', () => {
      const result: CommentModel = service.createCommentModel(commentAndSelect);
      expect(result).toBeInstanceOf(CommentModel);
      expect(result.id).toBe(commentAndSelect.id);
      expect(result.content).toBe(commentAndSelect.content);
      expect(result.createdAt).toBe(commentAndSelect.createdAt);
      expect(result.updatedAt).toBe(commentAndSelect.updatedAt);
      expect(result.parentCommentId).toBe(commentAndSelect.parentCommentId);
      expect(result.deletedAt).toBe(commentAndSelect.deletedAt);
      expect(result.postId).toBe(commentAndSelect.postId);
      expect(result.author).toBeInstanceOf(AuthorModel);
      expect(result.author.id).toBe(commentAndSelect.author.id);
      expect(result.author.username).toBe(commentAndSelect.author.username);
    });
  });

  describe('createOnPost()', () => {
    let addCommentOnPostDto: AddCommentOnPostDto;

    beforeEach(() => {
      addCommentOnPostDto = {
        content: 'comment',
      };

      (prismaService.comment.create as jest.Mock).mockResolvedValue(commentAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.createOnPost(addCommentOnPostDto, postId, userId);
      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'comment',
          post: { connect: { id: postId } },
          author: { connect: { id: userId } },
          parentComment: undefined,
        },
        select: commentSelect,
      });
    });

    it('should map response to CommentModel', async () => {
      const result: CommentModel = await service.createOnPost(addCommentOnPostDto, postId, userId);
      expect(result).toBeInstanceOf(CommentModel);
    });

    it('should correctly handle parent comment', async () => {
      await service.createOnPost(addCommentOnPostDto, postId, userId, parentCommentId);
      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'comment',
          post: { connect: { id: postId } },
          author: { connect: { id: userId } },
          parentComment: { connect: { id: parentCommentId } },
        },
        select: commentSelect,
      });
    });
  });

  describe('findById()', () => {
    let commentId: number;

    beforeEach(() => {
      commentId = 1;
      (prismaService.comment.findUnique as jest.Mock).mockResolvedValue(commentAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.findById(commentId);
      expect(prismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
        select: commentSelect,
      });
    });

    it('should map response to CommentModel', async () => {
      const result: CommentModel = await service.findById(commentId);
      expect(result).toBeInstanceOf(CommentModel);
    });
  });

  describe('findByPostId()', () => {
    beforeEach(() => {
      (prismaService.comment.findMany as jest.Mock).mockResolvedValue([commentAndSelect]);
    });

    it('should call prisma service with correct args', async () => {
      await service.findByPostId(postId);
      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: { postId },
        select: commentSelect,
      });
    });

    it('should map response to CommentModel', async () => {
      const result: CommentModel[] = await service.findByPostId(postId);
      expect(result[0]).toBeInstanceOf(CommentModel);
    });
  });

  describe('softDeleteById()', () => {
    it('should call prisma service with correct args', async () => {
      await service.softDeleteById(postId);
      expect(prismaService.comment.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: { deletedAt: new Date() },
      });
    });
  });

  describe('softDeletePostId()', () => {
    it('should call prisma service with correct args', async () => {
      await service.softDeleteByPostId(postId);
      expect(prismaService.comment.updateMany).toHaveBeenCalledWith({
        where: { postId: postId, deletedAt: null },
        data: { deletedAt: new Date() },
      });
    });
  });
});
