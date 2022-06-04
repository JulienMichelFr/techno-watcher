import { AddCommentOnPostDto, CommentModel } from '@techno-watcher/api-models';

export abstract class CommentRepositoryService {
  public abstract createOnPost(addCommentOnPostDto: AddCommentOnPostDto, postId: number, userId: number, parentCommentId: number | null): Promise<CommentModel>;

  public abstract findByPostId(postId: number): Promise<CommentModel[]>;

  public abstract findById(id: number): Promise<CommentModel>;

  public abstract softDeleteById(id: number): Promise<void>;

  public abstract softDeleteByPostId(postId: number): Promise<void>;
}
