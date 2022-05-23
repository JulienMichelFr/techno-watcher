import * as supertest from 'supertest';
import { signIn } from '../helpers/signin';
import { seed } from './seed-posts';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';

describe('Posts', () => {
  let bearerToken: string;
  let app: INestApplication;

  beforeAll(async () => {
    await seed();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
    const { accessToken } = await signIn(app);
    bearerToken = `Bearer ${accessToken}`;
  });

  it('GET /posts', async () => {
    return supertest(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('GET /posts?skip=10&take=10', async () => {
    return supertest(app.getHttpServer())
      .get('/posts?skip=10&take=10')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('GET /posts?sort=id:ASC', async () => {
    return supertest(app.getHttpServer())
      .get('/posts?sort=id:asc')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('GET /posts/13', async () => {
    return supertest(app.getHttpServer())
      .get('/posts/13')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('POST /posts', async () => {
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

  it('POST /posts (Authenticated)', async () => {
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

  it('DELETE /posts/12', async () => {
    return supertest(app.getHttpServer())
      .delete('/posts/12')
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('DELETE /posts/11 (Invalid user)', async () => {
    return supertest(app.getHttpServer())
      .delete('/posts/11')
      .set('Authorization', bearerToken)
      .expect(403)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('DELETE /posts/13 (Authorized)', async () => {
    return supertest(app.getHttpServer()).delete('/posts/13').set('Authorization', bearerToken).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
