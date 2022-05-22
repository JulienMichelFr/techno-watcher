import { PostService } from '../../services/post/post.service';
import { CommentService } from '../../services/comments/comment.service';
import { PostController } from './post.controller';
import { AddCommentOnPostDto, CreatePostDto, GetPostsDto } from '@techno-watcher/api-models';
import { Prisma, User } from '@prisma/client';

describe('PostController', () => {
  let postService: PostService;
  let commentService: CommentService;
  let postController: PostController;

  let postSelect: Prisma.PostSelect;
  let commentSelect: Prisma.CommentSelect;
  let user: User;

  beforeEach(() => {
    postSelect = {
      _count: true,
      author: {
        select: {
          username: true,
        },
      },
      comments: false,
      content: true,
      createdAt: true,
      id: true,
      link: true,
      tags: true,
      title: true,
      updatedAt: true,
    };
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
      findOne: jest.fn(),
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
      expect(postService.find).toHaveBeenCalledWith(
        {
          where: {
            deletedAt: null,
          },
          skip: getPostsDto.skip,
          take: getPostsDto.take,
          orderBy: [{ createdAt: 'desc' }],
          select: postSelect,
        },
        true
      );
    });

    it('should add tags in where clause', async () => {
      getPostsDto.tags = ['tag1', 'tag2'];
      await postController.getPosts(getPostsDto);
      expect(postService.find).toHaveBeenCalledWith(
        {
          where: {
            deletedAt: null,
            tags: {
              hasSome: getPostsDto.tags,
            },
          },
          skip: getPostsDto.skip,
          take: getPostsDto.take,
          orderBy: [{ createdAt: 'desc' }],
          select: postSelect,
        },
        true
      );
    });
  });

  describe('getPost()', () => {
    it('should call postService.findOne()', async () => {
      await postController.getPost(1);
      expect(postService.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: postSelect,
      });
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
      expect(postService.create).toHaveBeenCalledWith(
        {
          ...createPostDto,
          author: {
            connect: {
              id: user.id,
            },
          },
        },
        { select: postSelect }
      );
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
    it('should get post from service', async () => {
      (postService.findOne as jest.Mock).mockResolvedValueOnce({ authorId: user.id });
      await postController.deletePost(1, user);
      expect(postService.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          authorId: true,
        },
      });
    });

    it('should call postService.softDeletePost()', async () => {
      (postService.findOne as jest.Mock).mockResolvedValueOnce({ authorId: user.id });
      await postController.deletePost(1, user);
      expect(postService.softDeleteById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if post is not found', async () => {
      await expect(postController.deletePost(1, user)).rejects.toThrowError('Post with id 1 not found');
    });

    it('should throw an error if user is not the author', async () => {
      (postService.findOne as jest.Mock).mockResolvedValueOnce({ authorId: 2 });
      await expect(postController.deletePost(1, user)).rejects.toThrowError('You are not allowed to delete this post');
    });
  });
});
