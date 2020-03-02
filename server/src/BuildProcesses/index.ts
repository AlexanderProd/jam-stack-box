import { BuildProcess } from '../types';

const BuildProcesses = (() => {
  let processes: BuildProcess = {};

  const get = (): BuildProcess => {
    return processes;
  };

  const set = (process: BuildProcess) => {
    processes = {
      ...processes,
      ...process,
    };
  };

  const del = (id: string) => {
    delete processes[id];
  };

  return { get, set, del };
})();

export default BuildProcesses;
