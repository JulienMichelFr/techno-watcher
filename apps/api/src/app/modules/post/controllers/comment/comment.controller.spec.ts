import { CommentService } from '../../services/comments/comment.service';
import { CommentController } from './comment.controller';
import { NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('CommentController', () => {
  let commentService: CommentService;
  let controller: CommentController;

  beforeEach(() => {
    commentService = {
      findOne: jest.fn(),
      softDeleteComment: jest.fn(),
    } as unknown as CommentService;

    controller = new CommentController(commentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteComment', () => {
    let user: User;

    beforeEach(() => {
      user = { id: 1 } as User;
    });

    it('should return an error if the comment does not exist', async () => {
      (commentService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(controller.deleteComment(1, user)).rejects.toThrow(new NotFoundException('Comment not found'));
    });

    it('should return an error if the user is not the author of the comment', async () => {
      (commentService.findOne as jest.Mock).mockResolvedValue({ authorId: 2 } as unknown as Comment);
      await expect(controller.deleteComment(1, user)).rejects.toThrow(new NotFoundException('You are not the author of this comment'));
    });

    it('should soft delete the comment', async () => {
      (commentService.findOne as jest.Mock).mockResolvedValue({ authorId: user.id } as unknown as Comment);
      await controller.deleteComment(1, user);
      expect(commentService.softDeleteComment).toHaveBeenCalledWith(1);
    });
  });
});
