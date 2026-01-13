import { IsEmail, IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UploadFileDto {
  @IsEmail({}, { message: 'Please provide a valid recipient email address' })
  @IsNotEmpty({ message: 'Recipient email is required' })
  recipientEmail: string;

  @IsString({ message: 'Encryption key must be a string' })
  @IsNotEmpty({ message: 'Encryption key is required' })
  @IsUUID('4', { message: 'Encryption key must be a valid UUID' })
  encryptionKey: string;
}
