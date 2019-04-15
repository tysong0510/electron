import { EventEmitter } from 'events';
// import { promisify } from 'util';
// import * as ApplicationConfigFactory from 'application-config';
import electron from 'electron';
// import config from './config';
import * as fs from 'fs';
import path from 'path';
import * as config from './config';

const { readFileSync, writeFileSync, renameSync } = fs;
// ['readFile', 'writeFile', 'rename'].forEach(name => { fs[`${name}Async`] = promisify(fs[name]) })
// const { readFileAsync, writeFileAsync, renameAsync } = fs;

const SAVE_DEBOUNCE_INTERVAL = 1000;
// const appConfig = ApplicationConfigFactory('voxpop');
// appConfig.filePath = path.join(config.CONFIG_PATH, 'config.json')
// appConfig.readAsync = promisify(appConfig.read);
// appConfig.writeAsync = promisify(appConfig.write);

async function createNewState() {
  return {
    torrents: [],
    torrentsToResume: [],
    // To allow migrations in future
    version: config.APP_VERSION,
  };
}

async function applyLoadedState(state) {
  // TODO:
  return state;
}

const settingsDir = (electron.app || electron.remote.app).getPath('userData');
const settingsFile = path.join(settingsDir, 'config.json');

async function readFile() {
  let raw;
  let result;
  try {
    raw = readFileSync(settingsFile, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    raw = '{}';
  }
  result = JSON.parse(raw);

  return result;
}

async function writeFile(data) {
  const tempFilePath = settingsFile + Math.random().toString().substr(2)
    + Date.now().toString();
  writeFileSync(tempFilePath, JSON.stringify(data, void 0, 2));
  renameSync(tempFilePath, settingsFile);
}

export const State = new EventEmitter();
State.load = async function load() {
  let result;
  let isNewState = false;
  try {
    result = await readFile();
    // result = await appConfig.readAsync();
    if (!result.version) {
      throw new Error('Invalid state file');
    }
  } catch (err) {
    isNewState = true;
    result = await createNewState();
    // console.warn('new state', result);
  }
  if (!isNewState) {
    result = await applyLoadedState(result);
    // console.warn('loaded state', result);
  }

  return result;
};

State.save = async function save(state) {
  // Perf optimization: Lazy-require debounce (and it's dependencies)
  const debounce = require('debounce');
  // After first State.save() invokation, future calls go straight to the
  // debounced function
  State.save = debounce(State.saveImmediate, SAVE_DEBOUNCE_INTERVAL);
  State.save(state);
};

State.saveImmediate = async function saveImmediate(state) {
  try {
    // await appConfig.writeAsync(copy);
    await writeFile(state);
    State.emit('stateSaved');
  } catch (err) {
    console.error(err);
  }
};
