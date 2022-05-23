import * as supertest from 'supertest';
import { signIn } from '../helpers/signin';
import { seed } from './seed-posts';

describe('Posts', () => {
  let bearerToken: string;
  beforeAll(async () => {
    await seed();
    const { accessToken } = await signIn();
    bearerToken = `Bearer ${accessToken}`;
  });

  /*afterAll(async () => {
    await clearDatabase();
  });*/

  it('GET /posts', async () => {
    return supertest('http://localhost:3333')
      .get('/posts')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('GET /posts?skip=10&take=10', async () => {
    return supertest('http://localhost:3333')
      .get('/posts?skip=10&take=10')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('GET /posts?sort=id:ASC', async () => {
    return supertest('http://localhost:3333')
      .get('/posts?sort=id:asc')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('GET /posts/13', async () => {
    return supertest('http://localhost:3333')
      .get('/posts/13')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('POST /posts', async () => {
    return supertest('http://localhost:3333')
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
    return supertest('http://localhost:3333')
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
    return supertest('http://localhost:3333')
      .delete('/posts/12')
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('DELETE /posts/11 (Invalid user)', async () => {
    return supertest('http://localhost:3333')
      .delete('/posts/11')
      .set('Authorization', bearerToken)
      .expect(403)
      .expect((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('DELETE /posts/13 (Authorized)', async () => {
    return supertest('http://localhost:3333').delete('/posts/13').set('Authorization', bearerToken).expect(200);
  });
});
