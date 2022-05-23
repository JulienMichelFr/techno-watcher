import { AuthResponseModel } from '@techno-watcher/api-models';
import * as supertest from 'supertest';

export async function signIn(email: string = 'user1@email.com', password: string = 'Pas$w0rd'): Promise<AuthResponseModel> {
  const { body } = await supertest('http://localhost:3333').post('/auth/sign-in').send({ email, password }).expect(200);
  return body;
}
