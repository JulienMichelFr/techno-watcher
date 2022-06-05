import { AddCommentOnPostDto, CommentModel } from '@techno-watcher/api-models';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepositoryService } from '../../repositories/comment/comment-repository.service';
import { CommentService } from './comment.service';
import { UserModel } from '../../../user/models/user/user.model';

describe('CommentService', () => {
  let repository: CommentRepositoryService;
  let service: CommentService;

  let user: UserModel;
  let comment: CommentModel;
  let postId: number;

  beforeEach(async () => {
    user = { id: 1 } as UserModel;
    comment = new CommentModel();
    comment.id = 2;
    comment.author = user;
    postId = 3;

    repository = {
      createOnPost: jest.fn(),
      findById: jest.fn(),
      findByPostId: jest.fn(),
      softDeleteById: jest.fn(),
      softDeleteByPostId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CommentRepositoryService, useValue: repository }, CommentService],
    }).compile();

    service = module.get<CommentService>(CommentService);
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

  describe('createOnPost()', () => {
    let addCommentOnPostDto: AddCommentOnPostDto;

    beforeEach(() => {
      addCommentOnPostDto = {
        content: 'content',
      };
    });

    it('should call repository.createOnPost()', async () => {
      await service.createOnPost(addCommentOnPostDto, postId, user.id, comment.id);
      expect(repository.createOnPost).toHaveBeenCalledWith(addCommentOnPostDto, postId, user.id, comment.id);
    });
  });

  describe('findByPostId()', () => {
    it('should call repository.findByPostId()', async () => {
      await service.findByPostId(postId);
      expect(repository.findByPostId).toHaveBeenCalledWith(postId);
    });
  });

  describe('softDeleteById()', () => {
    beforeEach(() => {
      (repository.findById as jest.Mock).mockReturnValue(comment);
    });

    it('should call repository.softDeleteById()', async () => {
      await service.softDeleteById(comment.id, user.id);
      expect(repository.softDeleteById).toHaveBeenCalledWith(comment.id);
    });

    it('should get comment before deleting', async () => {
      await service.softDeleteById(comment.id, user.id);
      expect(repository.findById).toHaveBeenCalledWith(comment.id);
    });

    it('should throw an error if provided user is not comment author', async () => {
      await expect(service.softDeleteById(comment.id, 2)).rejects.toThrow('You are not allowed to delete this comment');
    });
  });
});
