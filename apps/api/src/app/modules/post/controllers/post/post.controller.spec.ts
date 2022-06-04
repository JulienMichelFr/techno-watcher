import { PostService } from '../../services/post/post.service';
import { CommentService } from '../../services/comments/comment.service';
import { PostController } from './post.controller';
import { AddCommentOnPostDto, CreatePostDto, GetPostsDto } from '@techno-watcher/api-models';
import { User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostController', () => {
  let postService: PostService;
  let commentService: CommentService;
  let postController: PostController;

  let user: User;
  let postId: number;

  beforeEach(async () => {
    user = { id: 1 } as User;

    postId = 2;

    postService = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      softDeleteById: jest.fn(),
    } as unknown as PostService;

    commentService = {
      findByPostId: jest.fn(),
      createOnPost: jest.fn(),
    } as unknown as CommentService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: PostService, useValue: postService },
        { provide: CommentService, useValue: commentService },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  describe('getPosts()', () => {
    let getPostsDto: GetPostsDto;

    beforeEach(() => {
      getPostsDto = {
        skip: 0,
        take: 10,
        sort: 'createdAt:desc',
        tags: [],
      };
    });

    it('should call postService.find()', async () => {
      await postController.getPosts(getPostsDto);
      expect(postService.find).toHaveBeenCalledWith(getPostsDto);
    });
  });

  describe('getPost()', () => {
    it('should call postService.findById()', async () => {
      await postController.getPost(postId);
      expect(postService.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('create()', () => {
    let createPostDto: CreatePostDto;

    beforeEach(() => {
      createPostDto = {
        title: 'title',
        content: 'content',
        link: 'link',
        tags: ['tag1', 'tag2'],
      };
    });

    it('should call postService.create()', async () => {
      await postController.create(createPostDto, user);
      expect(postService.create).toHaveBeenCalledWith(createPostDto, user.id);
    });
  });

  describe('addComment()', () => {
    let addCommentOnPostDto: AddCommentOnPostDto;

    beforeEach(() => {
      addCommentOnPostDto = {
        content: 'content',
      };
    });

    it('should call commentService.createOnPost()', async () => {
      await postController.addComment(addCommentOnPostDto, user, postId);
      expect(commentService.createOnPost).toHaveBeenCalledWith(addCommentOnPostDto, postId, user.id, null);
    });
  });

  describe('replyComment()', () => {
    let addCommentOnPostDto: AddCommentOnPostDto;
    let parentCommentId: number;

    beforeEach(() => {
      parentCommentId = 3;
      addCommentOnPostDto = {
        content: 'content',
      };
    });

    it('should call commentService.createOnPost()', async () => {
      await postController.replyToComment(addCommentOnPostDto, user, postId, parentCommentId);
      expect(commentService.createOnPost).toHaveBeenCalledWith(addCommentOnPostDto, postId, user.id, parentCommentId);
    });
  });

  describe('getCommentsOnPost()', () => {
    it('should call commentService.find()', async () => {
      await postController.getCommentsOnPost(postId);
      expect(commentService.findByPostId).toHaveBeenCalledWith(postId);
    });
  });

  describe('deletePost()', () => {
    it('should call postService.softDeletePost()', async () => {
      await postController.deletePost(postId, user);
      expect(postService.softDeleteById).toHaveBeenCalledWith(postId, user.id);
    });
  });
});
