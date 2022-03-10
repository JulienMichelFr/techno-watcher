import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PostService {
  public constructor(private prisma: PrismaService) {}

  public async create(post: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data: post });
  }
}
