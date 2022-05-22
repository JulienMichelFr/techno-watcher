import { PrismaService } from '../../../prisma/prisma.service';
import { CommentService } from './comment.service';
import { Prisma, User } from '@prisma/client';

describe('CommentService', () => {
  let prismaService: PrismaService;
  let commentService: CommentService;

  let user: User;

  beforeEach(() => {
    user = { id: 1 } as User;

    prismaService = {
      comment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      } as unknown as PrismaService,
    } as unknown as PrismaService;

    commentService = new CommentService(prismaService);
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('createOnPost()', () => {
    it('should call prisma service with correct args', async () => {
      await commentService.createOnPost('comment', 1, null, user);
      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'comment',
          post: { connect: { id: 1 } },
          author: { connect: { id: user.id } },
          parentComment: undefined,
        },
      });
    });

    it('should correctly handle parent comment', async () => {
      await commentService.createOnPost('comment', 1, 2, user);
      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'comment',
          post: { connect: { id: 1 } },
          author: { connect: { id: user.id } },
          parentComment: { connect: { id: 2 } },
        },
      });
    });

    it('should add extra args', async () => {
      await commentService.createOnPost('comment', 1, null, user, { select: { id: true } });
      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'comment',
          post: { connect: { id: 1 } },
          author: { connect: { id: user.id } },
          parentComment: undefined,
        },
        select: { id: true },
      });
    });
  });

  describe('find()', () => {
    it('should call prisma service with correct args', async () => {
      const conditions: Prisma.CommentFindManyArgs = { where: { post: { id: 1 } } };
      await commentService.find(conditions);
      expect(prismaService.comment.findMany).toHaveBeenCalledWith(conditions);
    });
  });

  describe('findOne()', () => {
    it('should call prisma service with correct args', async () => {
      const conditions: Prisma.CommentFindUniqueArgs = { where: { id: 1 } };
      await commentService.findOne(conditions);
      expect(prismaService.comment.findUnique).toHaveBeenCalledWith(conditions);
    });
  });

  describe('softDeleteComment()', () => {
    it('should call prisma service with correct args', async () => {
      await commentService.softDeleteComment(1);
      expect(prismaService.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: new Date() },
      });
    });
  });
});
