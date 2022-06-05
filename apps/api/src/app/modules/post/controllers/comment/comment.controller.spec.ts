import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../../services/comments/comment.service';
import { CommentController } from './comment.controller';
import { UserModel } from '../../../user/models/user/user.model';

describe('CommentController', () => {
  let commentService: CommentService;
  let controller: CommentController;
  let user: UserModel;
  let commentId: number;

  beforeEach(async () => {
    commentId = 1;
    user = { id: 2 } as UserModel;

    commentService = {
      softDeleteById: jest.fn(),
    } as unknown as CommentService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: commentService }],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteComment', () => {
    it('should soft delete the comment', async () => {
      await controller.deleteComment(commentId, user);
      expect(commentService.softDeleteById).toHaveBeenCalledWith(commentId, user.id);
    });
  });
});
