import { PostService } from '../../services/post/post.service';
import { CommentService } from '../../services/comments/comment.service';
import { PostController } from './post.controller';
import { AddCommentOnPostDto, CreatePostDto, GetPostsDto } from '@techno-watcher/api-models';
import { Prisma, User } from '@prisma/client';

describe('PostController', () => {
  let postService: PostService;
  let commentService: CommentService;
  let postController: PostController;

  let commentSelect: Prisma.CommentSelect;
  let user: User;

  beforeEach(() => {
    commentSelect = {
      id: true,
      author: { select: { username: true } },
      content: true,
      createdAt: true,
      updatedAt: true,
      parentCommentId: true,
      deletedAt: true,
    };
    user = { id: 1 } as User;

    postService = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      softDeleteById: jest.fn(),
    } as unknown as PostService;

    commentService = {
      find: jest.fn(),
      createOnPost: jest.fn(),
    } as unknown as CommentService;

    postController = new PostController(postService, commentService);
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
      await postController.getPost(1);
      expect(postService.findById).toHaveBeenCalledWith(1);
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
      expect(postService.create).toHaveBeenCalledWith(createPostDto, 1);
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
      await postController.addComment(addCommentOnPostDto, user, 1);
      expect(commentService.createOnPost).toHaveBeenCalledWith(addCommentOnPostDto.content, 1, null, user, { select: commentSelect });
    });
  });

  describe('replyComment()', () => {
    let addCommentOnPostDto: AddCommentOnPostDto;

    beforeEach(() => {
      addCommentOnPostDto = {
        content: 'content',
      };
    });

    it('should call commentService.createOnPost()', async () => {
      await postController.replyToComment(addCommentOnPostDto, user, 1, 2);
      expect(commentService.createOnPost).toHaveBeenCalledWith(addCommentOnPostDto.content, 1, 2, user, { select: commentSelect });
    });
  });

  describe('getCommentsOnPost()', () => {
    it('should call commentService.find()', async () => {
      await postController.getCommentsOnPost(1);
      expect(commentService.find).toHaveBeenCalledWith({
        where: {
          post: {
            id: 1,
          },
        },
        select: commentSelect,
      });
    });
  });

  describe('deletePost()', () => {
    it('should call postService.softDeletePost()', async () => {
      await postController.deletePost(1, user);
      expect(postService.softDeleteById).toHaveBeenCalledWith(1, 1);
    });
  });
});
