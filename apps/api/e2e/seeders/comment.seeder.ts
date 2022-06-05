import { Injectable } from '@nestjs/common';
import { rand, randParagraph, seed } from '@ngneat/falso';
import { Comment, Post, User } from '@prisma/client';

import { PrismaService } from '../../src/app/modules/prisma/prisma.service';
import { generateCount } from '../helpers/generate-count';
import { getDate } from '../helpers/get-date';

import { Seeder } from './base-seeder';
import { PostSeeder } from './post.seeder';
import { SEED_ID } from './seed-id';
import { UserSeeder } from './user.seeder';

seed(SEED_ID);

@Injectable()
export class CommentSeeder extends Seeder<Comment> {
  public constructor(protected readonly postSeeder: PostSeeder, protected readonly userSeeder: UserSeeder, protected readonly prisma: PrismaService) {
    super(prisma);
  }

  public async seed(): Promise<Comment[]> {
    const posts: Post[] = await this.postSeeder.seed();
    const users: User[] = this.userSeeder.getAll();

    let commentId: number = 1000;
    const postCommentMap: Map<number, number[]> = new Map<number, number[]>();
    posts.forEach(({ id }) => postCommentMap.set(id, []));

    function createComment(): Comment {
      const currentCommentId: number = ++commentId;
      const date: Date = getDate();
      const postId: number = rand(posts).id;
      let parentCommentId: number | null = null;
      const commentIds: number[] = postCommentMap.get(postId);
      if (commentIds?.length) {
        parentCommentId = rand(commentIds);
      }
      commentIds.push(currentCommentId);

      return {
        id: currentCommentId,
        content: randParagraph(),
        authorId: rand(users).id,
        postId,
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
        parentCommentId,
      };
    }

    await this.prisma.comment.createMany({
      data: generateCount(25, createComment),
    });

    const comments: Comment[] = await this.prisma.comment.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    this.store(comments);

    return comments;
  }

  public async clean(): Promise<void> {
    await this.prisma.comment.deleteMany({});
    this.clearData();
  }
}
