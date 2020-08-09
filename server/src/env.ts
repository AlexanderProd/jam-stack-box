import dotenv from 'dotenv';
import { join } from 'path';

const envResult = dotenv.config({ path: join(__dirname, '/../', '.env') });
if (envResult.error) throw envResult.error;
