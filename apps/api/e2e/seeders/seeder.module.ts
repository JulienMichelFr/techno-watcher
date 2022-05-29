import { Module, OnModuleInit } from '@nestjs/common';
import { InvitationSeeder } from './invitation.seeder';
import { UserSeeder } from './user.seeder';
import { PostSeeder } from './post.seeder';
import { CommentSeeder } from './comment.seeder';
import { PrismaService } from '../../src/app/modules/prisma/prisma.service';

@Module({
  providers: [InvitationSeeder, UserSeeder, PostSeeder, CommentSeeder],
  exports: [InvitationSeeder, UserSeeder, PostSeeder, CommentSeeder],
})
export class SeederModule implements OnModuleInit {
  public constructor(private prismaService: PrismaService) {}

  public async onModuleInit(): Promise<void> {
    await Promise.all([
      this.prismaService.invitation.deleteMany({}),
      this.prismaService.user.deleteMany({}),
      this.prismaService.post.deleteMany({}),
      this.prismaService.comment.deleteMany({}),
    ]);
  }
}
