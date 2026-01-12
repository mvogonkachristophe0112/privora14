import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('../prisma/prisma.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user successfully', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      (prismaService.users.create as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.signup(dto);

      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          password: expect.any(String),
        },
      });
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const user = {
        id: '1',
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
      };
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');
      (prismaService.sessions.create as jest.Mock).mockResolvedValue({
        id: '1',
        userId: user.id,
        token: 'refreshToken',
        expiresAt: expect.any(Date),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const dto = { email: 'test@example.com', password: 'wrongpassword' };
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});