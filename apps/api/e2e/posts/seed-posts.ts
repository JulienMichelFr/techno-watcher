import { Comment, Invitation, Post, PrismaClient, User } from '@prisma/client';
import { rand, randBetweenDate, randCatchPhrase, randNumber, randParagraph, randUrl, randWord, seed as falsoSeed } from '@ngneat/falso';
import * as bcrypt from 'bcrypt';

const prisma: PrismaClient = new PrismaClient();

falsoSeed('seed1');

//#region Seed utils
function generateCount<T>(count: number, fn: (index: number) => T): T[] {
  return Array.from({ length: count }).map((_, index) => fn(index));
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

function getDate(from: Date = new Date('01/01/2022'), to: Date = new Date('12/31/2022')): Date {
  return randBetweenDate({ from, to });
}

//#endregion

async function seedInvitations(): Promise<Invitation[]> {
  let invitationId: number = 0;

  function createInvitation(): { id: number; code: string } {
    return {
      id: ++invitationId,
      code: randWord(),
    };
  }

  await prisma.invitation.deleteMany({});
  await prisma.invitation.createMany({
    data: generateCount(2, createInvitation),
  });
  return prisma.invitation.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

async function seedUsers(invitations: Invitation[]): Promise<User[]> {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        email: 'user1@email.com',
        password: hashPassword('Pas$w0rd'),
        username: 'User 1',
        invitationId: invitations[0].id,
        createdAt: new Date(2022, 0, 1),
        updatedAt: new Date(2022, 0, 1),
      },
      {
        id: 2,
        email: 'user2@email.com',
        password: hashPassword('Pas$w0rd'),
        username: 'User 2',
        invitationId: invitations[1].id,
        createdAt: new Date(2022, 0, 1),
        updatedAt: new Date(2022, 0, 1),
      },
    ],
  });

  return prisma.user.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

async function seedPosts(users: User[]): Promise<Post[]> {
  let postId: number = 0;

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

  await prisma.post.createMany({
    data: generateCount(15, createPost),
  });

  return prisma.post.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

async function seedComments(users: User[], posts: Post[]): Promise<Comment[]> {
  let commentId: number = 0;
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

  await prisma.comment.createMany({
    data: generateCount(25, createComment),
  });

  return prisma.comment.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

export async function clearDatabase(): Promise<void> {
  await Promise.all([prisma.comment.deleteMany({}), prisma.post.deleteMany({}), prisma.user.deleteMany({}), prisma.invitation.deleteMany({})]);
}

export async function seed(): Promise<void> {
  await clearDatabase();

  const invitations: Invitation[] = await seedInvitations();
  const users: User[] = await seedUsers(invitations);
  const posts: Post[] = await seedPosts(users);
  const comments: Comment[] = await seedComments(users, posts);

  await prisma.$disconnect();
}
