import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';

export default registerAs('firebase', () => {
  return JSON.parse(readFileSync('src/helpers/firebaseconf.json', 'utf8'));
});
