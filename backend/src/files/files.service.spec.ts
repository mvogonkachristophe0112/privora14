import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

jest.mock('../prisma/prisma.service');
jest.mock('../events/events.gateway');

describe('FilesService', () => {
  let service: FilesService;
  let prismaService: jest.Mocked<PrismaService>;
  let eventsGateway: jest.Mocked<EventsGateway>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        PrismaService,
        EventsGateway,
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    prismaService = module.get(PrismaService);
    eventsGateway = module.get(EventsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const file = {
        buffer: Buffer.from('test file'),
        originalname: 'test.txt',
        size: 9,
        mimetype: 'text/plain',
      } as Express.Multer.File;
      const recipientEmail = 'recipient@example.com';
      const encryptionKey = 'key';
      const senderId = 'senderId';

      const recipient = { id: 'recipientId', email: recipientEmail };
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(recipient);
      (prismaService.files.create as jest.Mock).mockResolvedValue({
        id: 'fileId',
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        encryptedData: 'encrypted',
        salt: 'salt',
        iv: 'iv',
        authTag: 'tag',
        senderId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (prismaService.transfers.create as jest.Mock).mockResolvedValue({
        id: 'transferId',
        fileId: 'fileId',
        senderId,
        receiverId: recipient.id,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.uploadFile(file, recipientEmail, encryptionKey, senderId);

      expect(result).toEqual({ transferId: 'transferId' });
      expect(eventsGateway.emitToUser).toHaveBeenCalledWith(senderId, 'file_upload_success', expect.any(Object));
    });

    it('should throw BadRequestException if recipient not found', async () => {
      const file = {} as Express.Multer.File;
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.uploadFile(file, 'email', 'key', 'id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('downloadFile', () => {
    it('should download file successfully', async () => {
      const transferId = 'transferId';
      const decryptionKey = 'key';
      const userId = 'userId';

      const transfer = {
        id: transferId,
        receiverId: userId,
        file: {
          name: 'test.txt',
          type: 'text/plain',
          encryptedData: Buffer.from('encrypted').toString('base64'),
          salt: Buffer.from('salt').toString('base64'),
          iv: Buffer.from('iv').toString('base64'),
          authTag: Buffer.from('tag').toString('base64'),
        },
        senderId: 'senderId',
      };
      (prismaService.transfers.findUnique as jest.Mock).mockResolvedValue(transfer);
      (prismaService.transfers.update as jest.Mock).mockResolvedValue({});

      const result = await service.downloadFile(transferId, decryptionKey, userId);

      expect(result).toHaveProperty('buffer');
      expect(result.name).toBe('test.txt');
      expect(eventsGateway.emitToUser).toHaveBeenCalledTimes(3);
    });

    it('should throw ForbiddenException if not receiver', async () => {
      const transfer = { receiverId: 'otherId' };
      (prismaService.transfers.findUnique as jest.Mock).mockResolvedValue(transfer);

      await expect(service.downloadFile('id', 'key', 'userId')).rejects.toThrow(ForbiddenException);
    });
  });
});