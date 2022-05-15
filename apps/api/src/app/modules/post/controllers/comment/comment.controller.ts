import { Controller, Delete, ForbiddenException, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { CommentService } from '../../services/comments/comment.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { Comment, User } from '@prisma/client';

@Controller('comments')
export class CommentController {
  public constructor(private readonly commentService: CommentService) {}

  @Delete(':commentId')
  public async deleteComment(@Param('commentId', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    const comment: Comment | null = await this.commentService.findOne({ where: { id }, select: { id: true, authorId: true } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== user.id) {
      throw new ForbiddenException('You are not the author of this comment');
    }

    await this.commentService.softDeleteComment(id);
  }
}
