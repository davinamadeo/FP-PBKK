import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async uploadFile(file: any, userId: number, folderId?: number) {
    // Determine file type
    const fileType = this.getFileType(file.mimetype);

    // Verify folder ownership if folderId is provided
    if (folderId) {
      const folder = await this.prisma.folder.findUnique({
        where: { id: folderId },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      if (folder.ownerId !== userId) {
        throw new ForbiddenException('You do not have access to this folder');
      }
    }

    // Create file record
    const createdFile = await this.prisma.file.create({
      data: {
        name: file.originalname,
        type: fileType,
        size: file.size,
        path: file.path,
        ownerId: userId,
        folderId: folderId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Send email notification
    try {
      await this.mailService.sendFileUploadNotification(
        createdFile.owner.email,
        createdFile.owner.name || 'User',
        createdFile.name,
      );
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't fail the upload if email fails
    }

    return createdFile;
  }

  async findAll(userId: number, filters: any) {
    const { search, type, folderId, tagId, page, limit } = filters;

    const where: any = {
      ownerId: userId,
    };

    // Apply filters
    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (type) {
      where.type = type;
    }

    if (folderId) {
      where.folderId = folderId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId,
        },
      };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          folder: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      this.prisma.file.count({ where }),
    ]);

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this file');
    }

    return file;
  }

  async findOnePublic(id: number) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async remove(id: number, userId: number) {
    const file = await this.findOne(id, userId);

    // Delete physical file
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Failed to delete physical file:', error);
    }

    // Delete database record
    await this.prisma.file.delete({
      where: { id },
    });

    return { message: 'File deleted successfully' };
  }

  async addTag(fileId: number, tagId: number, userId: number) {
    // Verify file ownership
    await this.findOne(fileId, userId);

    // Verify tag ownership
    const tag = await this.prisma.tag.findFirst({
      where: {
        id: tagId,
        ownerId: userId,
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // Check if already tagged
    const existing = await this.prisma.fileTag.findUnique({
      where: {
        fileId_tagId: {
          fileId,
          tagId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Add tag
    return this.prisma.fileTag.create({
      data: {
        fileId,
        tagId,
      },
      include: {
        tag: true,
      },
    });
  }

  async removeTag(fileId: number, tagId: number, userId: number) {
    // Verify file ownership
    await this.findOne(fileId, userId);

    // Remove tag
    await this.prisma.fileTag.delete({
      where: {
        fileId_tagId: {
          fileId,
          tagId,
        },
      },
    });

    return { message: 'Tag removed successfully' };
  }

  private getFileType(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (
      mimetype.includes('document') ||
      mimetype.includes('word') ||
      mimetype.includes('sheet') ||
      mimetype.includes('text')
    ) {
      return 'document';
    }
    return 'other';
  }
}