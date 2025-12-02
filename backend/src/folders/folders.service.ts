import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFolderDto, userId: number) {
    return this.prisma.folder.create({
      data: {
        name: dto.name,
        ownerId: userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.folder.findMany({
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
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        files: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            files: true,
          },
        },
      },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this folder');
    }

    return folder;
  }

  async update(id: number, dto: UpdateFolderDto, userId: number) {
    // Check ownership
    const folder = await this.prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this folder');
    }

    // Update
    return this.prisma.folder.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async remove(id: number, userId: number) {
    // Check ownership
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this folder');
    }

    // Delete folder (files will be cascade deleted or set to null based on schema)
    await this.prisma.folder.delete({
      where: { id },
    });

    return { message: 'Folder deleted successfully', filesDeleted: folder.files.length };
  }

  async moveFile(folderId: number, fileId: number, userId: number) {
    // Check folder ownership
    const folder = await this.prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this folder');
    }

    // Check file ownership
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this file');
    }

    // Move file to folder
    return this.prisma.file.update({
      where: { id: fileId },
      data: {
        folderId: folderId,
      },
      include: {
        folder: true,
      },
    });
  }
}