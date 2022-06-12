import { randNumber, randParagraph, randRecentDate, randUserName, seed } from '@ngneat/falso';

import { CommentModel } from '@techno-watcher/api-models';

seed('my-seed-2');

type GenerateCommentOptions = { id?: number; parentId?: number; content?: string; username?: string };

export function generateComment({ id, parentId, content, username }: GenerateCommentOptions = {}): CommentModel {
  return {
    author: {
      id: randNumber(),
      username: username ?? randUserName(),
    },
    content: content ?? randParagraph(),
    createdAt: randRecentDate(),
    deletedAt: null,
    id: id ?? randNumber(),
    parentCommentId: parentId ?? null,
    postId: randNumber(),
    updatedAt: randRecentDate(),
  };
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
    generateComment({ id: 1 }),
    generateComment({ id: 2, parentId: 1 }),
    generateComment({ id: 3, parentId: 2 }),
    generateComment({ id: 4, parentId: 1 }),
    generateComment({ id: 5, parentId: 1 }),
    generateComment({ id: 6 }),
    generateComment({ id: 7 }),
    generateComment({ id: 8, parentId: 7 }),
  ];
}
