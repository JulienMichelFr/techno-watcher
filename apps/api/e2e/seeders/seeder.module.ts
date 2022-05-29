import { Module } from '@nestjs/common';
import { InvitationSeeder } from './invitation.seeder';
import { UserSeeder } from './user.seeder';
import { PostSeeder } from './post.seeder';
import { CommentSeeder } from './comment.seeder';

@Module({
  providers: [InvitationSeeder, UserSeeder, PostSeeder, CommentSeeder],
  exports: [InvitationSeeder, UserSeeder, PostSeeder, CommentSeeder],
})
export class SeederModule {}
