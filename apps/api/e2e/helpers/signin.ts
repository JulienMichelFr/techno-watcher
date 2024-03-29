import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { AuthResponseModel } from '@techno-watcher/api-models';

export async function signIn(app: INestApplication, email: string = 'user1@email.com', password: string = 'Pas$w0rd'): Promise<AuthResponseModel> {
  const { body } = await supertest(app.getHttpServer()).post('/auth/sign-in').send({ email, password }).expect(200);
  return body;
}
