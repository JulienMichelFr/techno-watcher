import * as supertest from 'supertest';
import { signIn } from '../helpers/signin';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { AddCommentOnPostDto } from '@techno-watcher/api-models';
import { CommentSeeder } from '../seeders/comment.seeder';
import { SeederModule } from '../seeders/seeder.module';

describe('Posts', () => {
  let bearerToken: string;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, SeederModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );
    await app.init();
    const commentSeeder: CommentSeeder = moduleRef.get<CommentSeeder>(CommentSeeder);
    await commentSeeder.seed();
    const { accessToken } = await signIn(app);
    bearerToken = `Bearer ${accessToken}`;
  });

  describe('Get posts', () => {
    it('Get multiple posts', async () => {
      return supertest(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Get multiple posts with pagination', async () => {
      return supertest(app.getHttpServer())
        .get('/posts?skip=10&take=10')
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Get multiple posts with sort', async () => {
      return supertest(app.getHttpServer())
        .get('/posts?sort=id:asc')
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Get a single post', async () => {
      return supertest(app.getHttpServer())
        .get('/posts/1013')
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });
  });

  describe('Get comments on post', () => {
    it('Get comments on post with id 1013', async () => {
      return supertest(app.getHttpServer())
        .get('/posts/1013/comments')
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });
  });

  describe('Create post', () => {
    it('Create a post (Unauthenticated)', async () => {
      return supertest(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Post',
          link: 'https://www.google.com/',
          content: 'My content',
          tags: ['tag1', 'tag2'],
        })
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Create a post (Authenticated)', async () => {
      return supertest(app.getHttpServer())
        .post('/posts')
        .set('Authorization', bearerToken)
        .send({
          title: 'Post',
          link: 'https://www.google.com/',
          content: 'My content',
          tags: ['tag1', 'tag2'],
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchSnapshot({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
  });

  describe('Create comment', () => {
    it('Create a comment on a post (Unauthenticated)', async () => {
      const data: AddCommentOnPostDto = {
        content: 'My comment',
      };
      return supertest(app.getHttpServer())
        .post('/posts/1013/comments')
        .send(data)
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Create a comment on a post (Authenticated)', async () => {
      const data: AddCommentOnPostDto = {
        content: 'My comment',
      };
      return supertest(app.getHttpServer())
        .post('/posts/1013/comments')
        .set('Authorization', bearerToken)
        .send(data)
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchSnapshot({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });

    it('Create a comment on a comment (Unauthenticated)', async () => {
      const data: AddCommentOnPostDto = {
        content: 'My comment',
      };
      return supertest(app.getHttpServer())
        .post('/posts/1013/comments/1001')
        .send(data)
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Create a comment on a comment (Authenticated)', async () => {
      const data: AddCommentOnPostDto = {
        content: 'My comment',
      };
      return supertest(app.getHttpServer())
        .post('/posts/1013/comments/1001')
        .set('Authorization', bearerToken)
        .send(data)
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchSnapshot({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
  });

  describe('Delete post', () => {
    it('Delete a post (Unauthenticated)', async () => {
      return supertest(app.getHttpServer())
        .delete('/posts/1012')
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Delete a post (Invalid user)', async () => {
      return supertest(app.getHttpServer())
        .delete('/posts/1012')
        .set('Authorization', bearerToken)
        .expect(403)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Delete a post (Authorized)', async () => {
      return supertest(app.getHttpServer()).delete('/posts/1011').set('Authorization', bearerToken).expect(200);
    });
  });

  describe('Delete comment', () => {
    it('Delete a comment (Unauthenticated)', async () => {
      return supertest(app.getHttpServer())
        .delete('/comments/1001')
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Delete a comment (Invalid user)', async () => {
      return supertest(app.getHttpServer())
        .delete('/comments/1004')
        .set('Authorization', bearerToken)
        .expect(403)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('Delete a comment (Authorized)', async () => {
      return supertest(app.getHttpServer()).delete('/comments/1003').set('Authorization', bearerToken).expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
