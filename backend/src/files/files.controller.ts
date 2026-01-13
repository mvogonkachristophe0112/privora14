import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
      fileFilter: (req, file, callback) => {
        // Allow common file types, block executables and potentially dangerous files
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'text/csv',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'audio/mpeg',
          'audio/wav',
          'video/mp4',
          'video/avi',
          'video/mov',
          'application/zip',
          'application/x-zip-compressed',
        ];

        const blockedExtensions = [
          '.exe',
          '.bat',
          '.cmd',
          '.scr',
          '.pif',
          '.com',
        ];

        const fileExtension = file.originalname
          .toLowerCase()
          .substring(file.originalname.lastIndexOf('.'));

        if (blockedExtensions.includes(fileExtension)) {
          return callback(
            new BadRequestException('File type not allowed'),
            false,
          );
        }

        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Unsupported file type'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
    @Req() req: any,
  ) {
    return this.filesService.uploadFile(
      file,
      body.recipientEmail,
      body.encryptionKey,
      req.user.id,
    );
  }

  @Get('download/:transferId')
  @UseGuards(JwtAuthGuard)
  async downloadFile(
    @Param('transferId') transferId: string,
    @Query('decryptionKey') decryptionKey: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { buffer, name, type } = await this.filesService.downloadFile(
      transferId,
      decryptionKey,
      req.user.id,
    );

    res.set({
      'Content-Type': type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${name}"`,
    });
    res.send(buffer);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async listFiles(@Req() req: any) {
    return this.filesService.listFiles(req.user.id);
  }
}
