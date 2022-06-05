import { ForbiddenException, Injectable } from '@nestjs/common';

import { AddCommentOnPostDto, CommentModel } from '@techno-watcher/api-models';

import { CommentRepositoryService } from '../../repositories/comment/comment-repository.service';

@Injectable()
export class CommentService {
  public constructor(private commentRepository: CommentRepositoryService) {}

  public async createOnPost(addCommentOnPostDto: AddCommentOnPostDto, postId: number, userId: number, commentId: number | null = null): Promise<CommentModel> {
    return this.commentRepository.createOnPost(addCommentOnPostDto, postId, userId, commentId);
  }

  public async findByPostId(postId: number): Promise<CommentModel[]> {
    return this.commentRepository.findByPostId(postId);
  }

  public async softDeleteById(commentId: number, userId: number): Promise<void> {
    const comment: CommentModel = await this.commentRepository.findById(commentId);

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    await this.commentRepository.softDeleteById(commentId);
  }
}
