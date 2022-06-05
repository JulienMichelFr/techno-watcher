import { randEmail, randNumber, randParagraph, randRecentDate, randUserName, seed } from '@ngneat/falso';
import { plainToInstance } from 'class-transformer';

import { CommentModel } from '@techno-watcher/api-models';

seed('my-seed-2');

export function generateComment(id: number = randNumber(), parentId: number | null = null): CommentModel {
  return plainToInstance(
    CommentModel,
    {
      id: id,
      createdAt: randRecentDate(),
      updatedAt: randRecentDate(),
      content: randParagraph(),
      parentCommentId: parentId,
      author: {
        id: randNumber(),
        createdAt: randRecentDate(),
        updatedAt: randRecentDate(),
        username: randUserName(),
        email: randEmail(),
      },
    },
    { excludeExtraneousValues: true }
  );
}

export function generateCommentList(): CommentModel[] {
  /*
    1
      2
         3
      4
      5
    6
    7
      8
   */
  return [
    generateComment(1),
    generateComment(2, 1),
    generateComment(3, 2),
    generateComment(4, 1),
    generateComment(5, 1),
    generateComment(6),
    generateComment(7),
    generateComment(8, 7),
  ];
}
