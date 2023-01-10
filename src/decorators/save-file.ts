import { createWriteStream, createReadStream } from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import { join } from 'path';
const generate_file_name = (mime: string) => {
  const file_type = mime.split('/')[1];
  const result =
    Date.now().toString() +
    '-' +
    (Math.random() + 1).toString(36).substring(7) +
    '.' +
    file_type;
  return result;
};
export const saveImage = async (image: Promise<FileUpload>, dir: string) => {
  const { filename, createReadStream, mimetype } = await image;

  if (!filename) {
    return join(process.cwd(), '/uploads/sample.png');
  }
  const file_path = `/uploads/${generate_file_name(mimetype)}`;
  createReadStream().pipe(createWriteStream(join(process.cwd(), file_path)));
  return `${dir}${file_path}`;
};

export const saveMultipleImage = async (
  imgs: [Promise<FileUpload>],
  dir: string,
) => {
  const file_paths = await Promise.all(
    imgs.map(async (image) => {
      const { filename, createReadStream, mimetype } = await image;
      if (!filename) {
        return join(__dirname, '/uploads/sample.png');
      }
      const file_path = `/uploads/${generate_file_name(mimetype)}`;
      createReadStream().pipe(
        createWriteStream(join(process.cwd(), file_path)),
      );
      return `${dir}${file_path}`;
    }),
  );
  return file_paths;
};
