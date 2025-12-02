import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  Res,
  Body,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: any,
    @Request() req,
    @Body('folderId') folderId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.filesService.uploadFile(
      file,
      req.user.userId,
      folderId ? parseInt(folderId) : undefined,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('folderId') folderId?: string,
    @Query('tagId') tagId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.filesService.findAll(req.user.userId, {
      search,
      type,
      folderId: folderId ? parseInt(folderId) : undefined,
      tagId: tagId ? parseInt(tagId) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id/view')
  async viewFile(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res,
  ) {
    // Find file without auth check for view
    const file = await this.filesService.findOnePublic(id);
    
    const fileStream = createReadStream(join(process.cwd(), file.path));
    
    // Set appropriate content type based on file type
    const contentTypes: any = {
      'image': 'image/jpeg',
      'pdf': 'application/pdf',
      'video': 'video/mp4',
      'audio': 'audio/mpeg',
    };
    
    res.set({
      'Content-Type': contentTypes[file.type] || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${file.name}"`,
      'Access-Control-Allow-Origin': '*',
    });
    
    return new StreamableFile(fileStream);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Res({ passthrough: true }) res,
  ) {
    const file = await this.filesService.findOne(id, req.user.userId);
    
    const fileStream = createReadStream(join(process.cwd(), file.path));
    
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });
    
    return new StreamableFile(fileStream);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.filesService.findOne(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.filesService.remove(id, req.user.userId);
  }

  @Post(':fileId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  async addTag(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
    @Request() req,
  ) {
    return this.filesService.addTag(fileId, tagId, req.user.userId);
  }

  @Delete(':fileId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  async removeTag(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
    @Request() req,
  ) {
    return this.filesService.removeTag(fileId, tagId, req.user.userId);
  }
}