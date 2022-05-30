import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { SeederModule } from '../seeders/seeder.module';
import { UserSeeder } from '../seeders/user.seeder';
import { InvitationSeeder } from '../seeders/invitation.seeder';
import * as supertest from 'supertest';
import { AuthResponseModel, RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { signIn } from '../helpers/signin';
import { sign } from 'jsonwebtoken';

describe('Auth', () => {
  let app: INestApplication;
  let userSeeder: UserSeeder;
  let invitationSeeder: InvitationSeeder;

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
    userSeeder = moduleRef.get<UserSeeder>(UserSeeder);
    invitationSeeder = moduleRef.get<InvitationSeeder>(InvitationSeeder);
    await userSeeder.seed();
  });

  describe('Sign in', () => {
    it('should sign in', async () => {
      const data: SignInDTO = {
        email: userSeeder.getAll()[0].email,
        password: 'Pas$w0rd',
      };
      return supertest(app.getHttpServer())
        .post('/auth/sign-in')
        .send(data)
        .expect(200)
        .expect((response) => {
          expect(response.body as AuthResponseModel).toMatchSnapshot({
            refreshToken: expect.any(String),
            accessToken: expect.any(String),
          });
        });
    });

    it('should reject unknown email', async () => {
      const data: SignInDTO = {
        email: 'invalid@email.com',
        password: 'Pas$w0rd',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-in')
        .send(data)
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject unknown password', async () => {
      const data: SignInDTO = {
        email: userSeeder.getAll()[0].email,
        password: 'unknown password',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-in')
        .send(data)
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject invalid email', async () => {
      const data: SignInDTO = {
        email: 'not an email',
        password: 'unknown password',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-in')
        .send(data)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });
  });

  describe('Sign up', () => {
    it('should reject invalid email', async () => {
      const data: SignUpDTO = {
        email: 'not an email',
        password: 'Pas$w0rd',
        invitation: invitationSeeder.getAll()[2].code,
        username: 'username',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject already used email', async () => {
      const data: SignUpDTO = {
        email: userSeeder.getAll()[0].email,
        password: 'Pas$w0rd',
        invitation: invitationSeeder.getAll()[2].code,
        username: 'username',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject invalid password', async () => {
      const data: SignUpDTO = {
        email: 'user@email.com',
        password: 'invalid password',
        invitation: invitationSeeder.getAll()[2].code,
        username: 'username',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject invalid invitation code', async () => {
      const data: SignUpDTO = {
        email: 'user@email.com',
        password: 'Pas$w0rd',
        invitation: 'invalid invitation code',
        username: 'username',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject already used invitation code', async () => {
      const data: SignUpDTO = {
        email: 'user@email.com',
        password: 'Pas$w0rd',
        invitation: invitationSeeder.getAll()[0].code,
        username: 'username',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(401)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject invalid username', async () => {
      const data: SignUpDTO = {
        email: 'user@email.com',
        password: 'Pas$w0rd',
        invitation: invitationSeeder.getAll()[2].code,
        username: 'u',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should reject already used username', async () => {
      const data: SignUpDTO = {
        email: 'user@email.com',
        password: 'Pas$w0rd',
        invitation: invitationSeeder.getAll()[2].code,
        username: userSeeder.getAll()[0].username,
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(400)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should sign up', () => {
      const data: SignUpDTO = {
        email: 'user@email.com',
        password: 'Pas$w0rd',
        invitation: invitationSeeder.getAll()[2].code,
        username: 'user',
      };

      return supertest(app.getHttpServer())
        .post('/auth/sign-up')
        .send(data)
        .expect(201)
        .expect((response) => {
          expect(response.body as AuthResponseModel).toMatchSnapshot({
            refreshToken: expect.any(String),
            accessToken: expect.any(String),
          });
        });
    });
  });

  describe('Refresh token', () => {
    it('should reject invalid refresh token', async () => {
      const token: string = sign({}, process.env.JWT_SECRET, { expiresIn: '0s' });
      const data: RefreshTokenDto = {
        refreshToken: token,
      };

      return supertest(app.getHttpServer())
        .post('/auth/refresh-token')
        .send(data)
        .expect(403)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should refresh token', async () => {
      const { refreshToken } = await signIn(app);
      const data: RefreshTokenDto = {
        refreshToken,
      };

      return supertest(app.getHttpServer())
        .post('/auth/refresh-token')
        .send(data)
        .expect(200)
        .expect((response) => {
          expect(response.body as AuthResponseModel).toMatchSnapshot({
            refreshToken: expect.any(String),
            accessToken: expect.any(String),
          });
        });
    });
  });
});
