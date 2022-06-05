import { CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';

export abstract class PostRepositoryService {
  public abstract findById(id: number): Promise<PostModel>;

  public abstract findPaginated(getPostsDto: GetPostsDto): Promise<Paginated<PostModel>>;

  public abstract create(createPostDto: CreatePostDto, userId: number): Promise<PostModel>;

  public abstract softDeleteById(postId: number): Promise<void>;
}
