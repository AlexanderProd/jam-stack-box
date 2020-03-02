import { Event } from '../sql';

export const isProd = process.env.NODE_ENV === 'development';

export const createSiteID = (): string => {
  return Math.random()
    .toString(36)
    .substring(2, 8);
};

export const saveBuildLog = (
  event: Event,
  stream: NodeJS.ReadWriteStream
): void => {
  const chunks: any[] = [];

  stream.on('data', chunk => chunks.push(chunk));
  stream.on('error', error => console.error(error));
  stream.on('end', () => {
    const data = Buffer.concat(chunks).toString('utf8');

    event.update({ log: data });
  });
};

export const sanitizeName = (name: string) =>
  name
    .trim()
    .replace(/\s/g, '-')
    .toLowerCase()
    .substr(0, 20);
