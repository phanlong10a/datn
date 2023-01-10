import { IsNotEmpty } from 'class-validator';
import { FileUpload } from 'graphql-upload-ts';

export class ImageUploadInput {
  @IsNotEmpty()
  file: Promise<FileUpload>;
}
