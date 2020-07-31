import { EventEmitter } from "events";
// import { promisify } from 'util';
// import * as ApplicationConfigFactory from 'application-config';
import electron from "electron";
// import config from './config';
import * as fs from "fs";
import path from "path";
import * as config from "./config";

const { readFileSync, writeFileSync, renameSync } = fs;
// ['readFile', 'writeFile', 'rename'].forEach(name => { fs[`${name}Async`] = promisify(fs[name]) })
// const { readFileAsync, writeFileAsync, renameAsync } = fs;

const SAVE_DEBOUNCE_INTERVAL = 1000;

// const USER_CONFIG_FILENAME = 'config.json';
// const appConfig = ApplicationConfigFactory('voxpop');
// appConfig.filePath = path.join(config.CONFIG_PATH, 'config.json')
// appConfig.readAsync = promisify(appConfig.read);
// appConfig.writeAsync = promisify(appConfig.write);

async function createNewAppState() {
  return {
    // To allow migrations in future
    version: config.APP_VERSION
  };
}

async function applyLoadedAppState(state) {
  // TODO:
  return state;
}

async function createNewUserState(userId) {
  return {
    userId,
    torrents: [],
    torrentsToResume: [],
    // To allow migrations in future
    version: config.APP_VERSION
  };
}

async function applyLoadedUserState(userId, state) {
  // TODO:
  return state;
}

const appSettingsDir = (electron.app || electron.remote.app).getPath("userData");
const appSettingsFile = path.join(appSettingsDir, "config.json");

function getUserConfigPath(userId) {
  return path.join(appSettingsDir, "voxpop", userId, "config.json");
}

async function readConfigFile(configPath) {
  let raw;
  let result;
  try {
    raw = readFileSync(configPath, "utf8");
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    raw = "{}";
  }
  result = JSON.parse(raw);

  return result;
}

// async function writeUserFile(configPath, data) {
//   if (!configPath) {
//     throw Error("Path must be string");
//   }
//
//   const configFile = path.join(configPath, USER_CONFIG_FILENAME);
//
//   const tempFilePath = configFile + Math.random().toString().substr(2)
//     + Date.now().toString();
//
//   writeFileSync(tempFilePath, JSON.stringify(data, void 0, 2));
//
//   renameSync(tempFilePath, configFile);
// }

async function writeConfigFile(configPath, data) {
  const tempFilePath =
    configPath +
    Math.random()
      .toString()
      .substr(2) +
    Date.now().toString();
  writeFileSync(tempFilePath, JSON.stringify(data, void 0, 2));
  renameSync(tempFilePath, configPath);
}

export const State = new EventEmitter();
State.load = async function load() {
  let result;
  let isNewState = false;
  try {
    result = await readConfigFile(appSettingsFile);
    // result = await appConfig.readAsync();
    if (!result.version) {
      throw new Error("Invalid state file");
    }
  } catch (err) {
    isNewState = true;
    result = await createNewAppState();
    console.warn("new app state", result);
  }
  if (!isNewState) {
    result = await applyLoadedAppState(result);
    // console.warn("loaded app state", result);
  }

  return result;
};

State.save = async function save(state) {
  // Perf optimization: Lazy-require debounce (and it's dependencies)
  const debounce = require("debounce");
  // After first State.save() invokation, future calls go straight to the
  // debounced function
  State.save = debounce(State.saveImmediate, SAVE_DEBOUNCE_INTERVAL);
  State.save(state);
};

State.saveImmediate = async function saveImmediate(state) {
  try {
    const data = {
      ...state,
      version: config.APP_VERSION
    };
    // await appConfig.writeAsync(copy);
    await writeConfigFile(appSettingsFile, data);
    console.warn("saved app state", data);
    State.emit("stateSaved");
  } catch (err) {
    console.error(err);
  }
};

State.loadUser = async function loadUser(userId) {
  let result;
  let isNewState = false;
  try {
    result = await readConfigFile(getUserConfigPath(userId));
    // result = await appConfig.readAsync();
    if (!result.version) {
      throw new Error("Invalid state file");
    }
  } catch (err) {
    isNewState = true;
    result = await createNewUserState(userId);
    console.warn("new user state", userId, result);
  }
  if (!isNewState) {
    result = await applyLoadedUserState(userId, result);
    // console.warn("loaded user state", userId, result);
  }

  return result;
};

State.saveUser = async function save(userId, state) {
  // Perf optimization: Lazy-require debounce (and it's dependencies)
  const debounce = require("debounce");
  // After first State.save() invokation, future calls go straight to the
  // debounced function
  State.saveUser = debounce(State.saveUserImmediate, SAVE_DEBOUNCE_INTERVAL);
  State.saveUser(userId, state);
};

State.saveUserImmediate = async function saveImmediate(userId, state) {
  try {
    const data = {
      ...state,
      userId,
      version: config.APP_VERSION
    };
    await writeConfigFile(getUserConfigPath(userId), data);
    console.warn("saved user state", userId, data);
    State.emit("userStateSaved", { userId });
  } catch (err) {
    console.error(err);
  }
};
