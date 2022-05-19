import { Comment, Invitation, Post, PrismaClient, User } from '@prisma/client';
import { rand, randCatchPhrase, randEmail, randNumber, randParagraph, randUrl, randWord, seed } from '@ngneat/falso';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

seed('seed1');

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

async function seedInvitations(): Promise<Invitation[]> {
  await prisma.invitation.deleteMany({});
  await prisma.invitation.createMany({
    data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  });

  return prisma.invitation.findMany();
}

async function seedUsers(invitations: Invitation[]): Promise<User[]> {
  await prisma.user.deleteMany({});

  const user1 = await prisma.user.upsert({
    where: { email: 'user@email.com' },
    update: {},
    create: {
      email: 'user@email.com',
      password: hashPassword('Pas$w0rd'),
      username: 'User 1',
      invitationId: invitations[0].id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@email.com' },
    update: {},
    create: {
      email: randEmail(),
      password: hashPassword('Pas$w0rd'),
      username: 'User 2',
      invitationId: invitations[1].id,
    },
  });

  return [user1, user2];
}

async function seedPosts(users: User[]): Promise<Post[]> {
  // Remove existing posts
  await prisma.post.deleteMany({});

  function createPost() {
    const userId: number = rand(users.map(({ id }) => id));
    const tags: string[] = Array.from({ length: randNumber({ min: 0, max: 3 }) }).map(() => randWord());

    return {
      title: randCatchPhrase(),
      link: randUrl(),
      content: randParagraph(),
      authorId: userId,
      tags: tags,
    };
  }

  await prisma.post.createMany({
    data: Array.from({ length: 50 }).map(() => createPost()),
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
  const invitations: Invitation[] = await seedInvitations();
  const users: User[] = await seedUsers(invitations);
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
