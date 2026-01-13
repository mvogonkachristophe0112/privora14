import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import * as crypto from 'crypto';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    recipientEmail: string,
    encryptionKey: string,
    senderId: string,
  ) {
    // Find recipient
    const recipient = await this.prisma.users.findUnique({
      where: { email: recipientEmail },
    });
    if (!recipient) {
      throw new BadRequestException('Recipient not found');
    }

    // Generate salt and derive key
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(encryptionKey, salt, 32);

    // Generate IV
    const iv = crypto.randomBytes(16);

    // Encrypt file
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(file.buffer),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Store in DB
    const fileRecord = await this.prisma.files.create({
      data: {
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        encryptedData: encrypted.toString('base64'),
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        senderId,
      },
    });

    // Create transfer
    const transfer = await this.prisma.transfers.create({
      data: {
        fileId: fileRecord.id,
        senderId,
        receiverId: recipient.id,
        status: 'pending',
      },
    });

    // Emit file upload success event
    this.eventsGateway.emitToUser(senderId, 'file_upload_success', {
      transferId: transfer.id,
      filename: file.originalname,
      recipientEmail: recipient.email,
    });

    return { transferId: transfer.id };
  }

  async downloadFile(
    transferId: string,
    decryptionKey: string,
    userId: string,
  ) {
    // Get transfer
    const transfer = await this.prisma.transfers.findUnique({
      where: { id: transferId },
      include: { file: true },
    });
    if (!transfer) {
      throw new BadRequestException('Transfer not found');
    }

    // Check if user is receiver
    if (transfer.receiverId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { file } = transfer;

    // Emit download initiation event
    this.eventsGateway.emitToUser(transfer.senderId, 'download_initiation', {
      transferId,
      filename: file.name,
      downloaderId: userId,
    });

    // Derive key using stored salt
    const key = crypto.scryptSync(
      decryptionKey,
      Buffer.from(file.salt, 'base64'),
      32,
    );

    // Decrypt
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(file.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(file.authTag, 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(file.encryptedData, 'base64')),
      decipher.final(),
    ]);

    // Update transfer status
    await this.prisma.transfers.update({
      where: { id: transferId },
      data: { status: 'downloaded' },
    });

    // Emit transfer update event
    this.eventsGateway.emitToUser(transfer.senderId, 'transfer_update', {
      transferId,
      status: 'downloaded',
      filename: file.name,
    });
    this.eventsGateway.emitToUser(transfer.receiverId, 'transfer_update', {
      transferId,
      status: 'downloaded',
      filename: file.name,
    });

    return {
      buffer: decrypted,
      name: file.name,
      type: file.type,
    };
  }

  async listFiles(userId: string) {
    const sentTransfers = await this.prisma.transfers.findMany({
      where: { senderId: userId },
      include: { file: true, receiver: true },
    });
    const receivedTransfers = await this.prisma.transfers.findMany({
      where: { receiverId: userId },
      include: { file: true, sender: true },
    });

    const sent = sentTransfers.map((t) => ({
      id: t.id,
      filename: t.file.name,
      size: t.file.size,
      date: t.createdAt.toISOString().split('T')[0],
      recipient: t.receiver.email,
      status: t.status,
    }));

    const received = receivedTransfers.map((t) => ({
      id: t.id,
      filename: t.file.name,
      size: t.file.size,
      date: t.createdAt.toISOString().split('T')[0],
      sender: t.sender.email,
      status: t.status,
    }));

    return { sent, received };
  }
}
