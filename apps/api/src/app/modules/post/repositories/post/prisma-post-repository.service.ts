import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';

import { AuthorModel, CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';

import { PrismaService } from '../../../prisma/prisma.service';

import { PostRepositoryService } from './post-repository.service';

export type PostAndSelect = Omit<Post, 'comments' | 'authorId'> & { author: { id: number; username: string }; _count: { comments: number } };

@Injectable()
export class PrismaPostRepositoryService extends PostRepositoryService {
  private readonly postSelect: Prisma.PostSelect = {
    id: true,
    title: true,
    link: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    tags: true,
    comments: false,
    author: {
      select: {
        id: true,
        username: true,
      },
    },
    _count: true,
  };

  public constructor(private prisma: PrismaService) {
    super();
  }

  public createPostModel(post: PostAndSelect): PostModel {
    const author: AuthorModel = new AuthorModel();
    author.id = post.author.id;
    author.username = post.author.username;

    const result: PostModel = new PostModel();
    result.id = post.id;
    result.title = post.title;
    result.link = post.link;
    result.content = post.content;
    result.createdAt = post.createdAt;
    result.updatedAt = post.updatedAt;
    result.tags = post.tags;
    result.totalComments = post._count.comments;
    result.author = author;

    return result;
  }

  public override async findById(id: number): Promise<PostModel> {
    const post: PostAndSelect = (await this.prisma.post.findUnique({
      where: { id },
      select: this.postSelect,
    })) as PostAndSelect;

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.createPostModel(post);
  }

  public override async findPaginated({ take, skip, sort, tags }: GetPostsDto): Promise<Paginated<PostModel>> {
    const [sortKey, sortOrder] = sort.split(':');

    let where: Prisma.PostWhereInput = {
      deletedAt: null,
    };
    if (tags?.length) {
      where = {
        ...where,
        tags: {
          hasSome: tags,
        },
      };
    }

    const [count, posts]: [number, PostAndSelect[]] = (await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: [{ [sortKey]: sortOrder }],
        select: this.postSelect,
      }),
    ])) as [number, PostAndSelect[]];

    const paginated: Paginated<PostModel> = new Paginated<PostModel>();
    paginated.total = count;
    paginated.from = skip ?? 0;
    paginated.to = (skip ?? 0) + (take ?? 10);
    paginated.data = posts.map((post: PostAndSelect) => {
      return this.createPostModel(post);
    });
    paginated.perPage = take ?? 10;

    return paginated;
  }

  public override async create(post: CreatePostDto, userId: number): Promise<PostModel> {
    const createdPost: PostAndSelect = (await this.prisma.post.create({
      data: {
        ...post,
        author: {
          connect: {
            id: userId,
          },
        },
      },
      select: this.postSelect,
    })) as PostAndSelect;

    return this.createPostModel(createdPost);
  }

  public override async softDeleteById(postId: number): Promise<void> {
    await this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });
  }
}
