import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';

import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { UserModel } from '../../../user/models/user/user.model';
import { CommentService } from '../../services/comments/comment.service';

@Controller('comments')
export class CommentController {
  public constructor(private readonly commentService: CommentService) {}

  @Delete(':commentId')
  public async deleteComment(@Param('commentId', ParseIntPipe) id: number, @GetUser() user: UserModel): Promise<void> {
    await this.commentService.softDeleteById(id, user.id);
  }
}
