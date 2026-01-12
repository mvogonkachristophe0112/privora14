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

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { recipientEmail: string; encryptionKey: string },
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