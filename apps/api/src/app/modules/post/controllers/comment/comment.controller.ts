import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { CommentService } from '../../services/comments/comment.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { User } from '@prisma/client';

@Controller('comments')
export class CommentController {
  public constructor(private readonly commentService: CommentService) {}

  @Delete(':commentId')
  public async deleteComment(@Param('commentId', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    await this.commentService.softDeleteById(id, user.id);
  }
}
