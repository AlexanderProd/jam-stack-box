import { Event } from '../sql';
import BuildProcesses from '../BuildProcesses';
import { docker } from '..';

export const isProd = process.env.NODE_ENV === 'production';

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
    .substr(0, 40);

/**
 * Recursively removes dots, slashes and whitespaces from the start and end of the string.
 * @param input A string which represents the directory where to build output is located.
 */
export const sanitizeBuildDir = (input: string): string => {
  let inputArr = input.split('');

  if (inputArr[0].match(/(\/|\.|\/|\\| )/gi) !== null) {
    inputArr.shift();
  }

  if (inputArr[inputArr.length - 1].match(/(\/|\.|\/|\\| )/gi) !== null) {
    inputArr.pop();
  }

  if (
    inputArr[0].match(/(\/|\.|\/|\\| )/gi) !== null ||
    inputArr[inputArr.length - 1].match(/(\/|\.|\/|\\| )/gi) !== null
  ) {
    return sanitizeBuildDir(inputArr.join(''));
  } else {
    return inputArr.join('');
  }
};

/*
 ** This stops the currently running build processes in case of a termination signal to the app.
 */
export const stopRunningBuilds = (code: number) => {
  const runningBuilds = BuildProcesses.get();

  for (const id in runningBuilds) {
    if (runningBuilds[id].container !== undefined) {
      const container = docker.getContainer(runningBuilds[id].container.id);
      container.kill({ signal: code });
    }
  }
};

export const calcuateBuildTime = (event: Event): number => {
  try {
    const milliseconds = Date.now() - event.createdAt.getTime();
    const seconds = Math.round(milliseconds / 1000);
    return seconds;
    /*if (seconds < 60) {
      return `0m ${seconds}s`;
    } else {
      const minutes = Math.round(seconds / 60);
      seconds = Math.round(seconds % 60);
      return `${minutes}m ${seconds}s`;
    } */
  } catch (error) {
    console.error(error);
  }
};
