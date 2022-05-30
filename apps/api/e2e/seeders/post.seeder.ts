import { Post, User } from '@prisma/client';
import { Seeder } from './base-seeder';
import { generateCount } from '../helpers/generate-count';
import { rand, randCatchPhrase, randNumber, randParagraph, randUrl, randWord, seed } from '@ngneat/falso';
import { getDate } from '../helpers/get-date';
import { UserSeeder } from './user.seeder';
import { SEED_ID } from './seed-id';
import { PrismaService } from '../../src/app/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

seed(SEED_ID);

@Injectable()
export class PostSeeder extends Seeder<Post> {
  public constructor(protected readonly prisma: PrismaService, protected readonly userSeeder: UserSeeder) {
    super(prisma);
  }

  public async seed(): Promise<Post[]> {
    const users: User[] = await this.userSeeder.seed();
    let postId: number = 1000;

    function createPost(): Post {
      const tags: string[] = generateCount(randNumber({ min: 0, max: 3 }), () => randWord());
      const date: Date = getDate();

      return {
        id: ++postId,
        link: randUrl(),
        title: randCatchPhrase(),
        content: randParagraph(),
        authorId: rand(users).id,
        tags,
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
      };
    }

    await this.prisma.post.createMany({
      data: generateCount(15, createPost),
    });

    const posts: Post[] = await this.prisma.post.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    this.store(posts);

    return posts;
  }

  public async clean(): Promise<void> {
    await this.prisma.post.deleteMany({});
    await this.clearData();
  }
}
