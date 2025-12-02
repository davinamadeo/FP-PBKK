import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/create-folder.dto';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private foldersService: FoldersService) {}

  @Post()
  async create(@Body() dto: CreateFolderDto, @Request() req) {
    return this.foldersService.create(dto, req.user.userId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.foldersService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.foldersService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFolderDto,
    @Request() req,
  ) {
    return this.foldersService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.foldersService.remove(id, req.user.userId);
  }

  @Patch(':id/move/:fileId')
  async moveFile(
    @Param('id', ParseIntPipe) folderId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
    @Request() req,
  ) {
    return this.foldersService.moveFile(folderId, fileId, req.user.userId);
  }
}