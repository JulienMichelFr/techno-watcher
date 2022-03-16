import { Comment, Post, PrismaClient, User } from '@prisma/client';
import { randEmail, randParagraph, randSentence, seed } from '@ngneat/falso';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

seed('seed1');

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

async function seedUsers(): Promise<User[]> {
  await prisma.user.deleteMany({});

  const user1 = await prisma.user.upsert({
    where: { email: 'user@email.com' },
    update: {},
    create: {
      email: 'user@email.com',
      password: hashPassword('Pas$w0rd'),
      username: 'User 1',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@email.com' },
    update: {},
    create: {
      email: randEmail(),
      password: hashPassword('Pas$w0rd'),
      username: 'User 2',
    },
  });

  return [user1, user2];
}

async function seedPosts(users: User[]): Promise<Post[]> {
  // Remove existing posts
  await prisma.post.deleteMany({});

  await prisma.post.createMany({
    data: [
      {
        title: randSentence(),
        content: randParagraph(),
        authorId: users[1].id,
      },
      {
        title: randSentence(),
        content: randParagraph(),
        authorId: users[0].id,
      },
      {
        title: randSentence(),
        content: randParagraph(),
        authorId: users[0].id,
      },
    ],
  });

  return prisma.post.findMany();
}

async function seedComments(users: User[], posts: Post[]): Promise<Comment[]> {
  const comment1 = await prisma.comment.create({
    data: {
      content: randParagraph(),
      authorId: users[1].id,
      postId: posts[0].id,
    },
  });
  const comment2OnComment1 = await prisma.comment.create({
    data: {
      content: randParagraph(),
      authorId: users[0].id,
      postId: posts[0].id,
      parentCommentId: comment1.id,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: randParagraph(),
      authorId: users[0].id,
      postId: posts[1].id,
    },
  });

  return [comment1, comment2OnComment1, comment3];
}

async function main() {
  const users: User[] = await seedUsers();
  const posts: Post[] = await seedPosts(users);
  const comments: Comment[] = await seedComments(users, posts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
