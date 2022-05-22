import { Injectable } from '@nestjs/common';
import { Post, Prisma, PrismaPromise } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Paginated } from '@techno-watcher/api-models';

@Injectable()
export class PostService {
  public constructor(private prisma: PrismaService) {}

  public async count(conditions: Prisma.PostCountArgs = {}): Promise<number> {
    return this.prisma.post.count(conditions);
  }

  public async findOne(args: Prisma.PostFindUniqueArgs): Promise<Post | null> {
    return this.prisma.post.findUnique(args);
  }

  public async find(conditions: Prisma.PostFindManyArgs, withCount: true): Promise<Paginated<Post>>;
  public async find(conditions: Prisma.PostFindManyArgs, withCount: false): Promise<Paginated<Post>>;
  public async find(conditions: Prisma.PostFindManyArgs = {}, withCount: boolean = false): Promise<Post[] | Paginated<Post>> {
    if (withCount) {
      const [count, posts] = await this.prisma.$transaction([
        this.count({ where: conditions.where ?? {} }) as PrismaPromise<number>,
        this.prisma.post.findMany(conditions),
      ]);

      return {
        total: count,
        from: conditions.skip ?? 0,
        to: (conditions.skip ?? 0) + (conditions.take ?? 10),
        data: posts,
        perPage: conditions.take ?? 10,
      };
    }
    return this.prisma.post.findMany(conditions);
  }

  public async create(post: Prisma.PostCreateInput, args: Prisma.PostArgs = {}): Promise<Post> {
    return this.prisma.post.create({ data: post, ...args });
  }

  public async softDeleteById(postId: number): Promise<void> {
    await this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });
  }
}
