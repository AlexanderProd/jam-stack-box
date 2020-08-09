import dotenv from 'dotenv';

const envResult = dotenv.config();
if (envResult.error) throw envResult.error;
