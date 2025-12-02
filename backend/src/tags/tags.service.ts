import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTagDto, userId: number) {
    // Check if tag already exists for this user
    const existing = await this.prisma.tag.findFirst({
      where: {
        name: dto.name,
        ownerId: userId,
      },
    });

    if (existing) {
      throw new ConflictException('Tag with this name already exists');
    }

    return this.prisma.tag.create({
      data: {
        name: dto.name,
        ownerId: userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.tag.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        _count: {
          select: {
            files: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        files: {
          include: {
            file: {
              include: {
                folder: true,
              },
            },
          },
        },
        _count: {
          select: {
            files: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (tag.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this tag');
    }

    return tag;
  }

  async remove(id: number, userId: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (tag.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this tag');
    }

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: 'Tag deleted successfully' };
  }
}