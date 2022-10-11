const path = require('path');
const { extendConfig } = require('hardhat/config');
const { HardhatPluginError } = require('hardhat/plugins');
const { name: PLUGIN_NAME } = require('./package.json');

require('./tasks/clear_bytecode.js');
require('./tasks/export_bytecode.js');
require('./tasks/compile.js');

const DEFAULT_CONFIG = {
  path: './bytecode',
  runOnCompile: false,
  clear: false,
  flat: false,
  only: [],
  except: [],
  spacing: 2,
  // `rename` is not defaulted as it may depend on `flat` option
};

function validate(config, key, type) {
  if (type === 'array') {
    if (!Array.isArray(config[key])) {
      throw new HardhatPluginError(PLUGIN_NAME, `\`${key}\` config must be an ${type}`);
    }
  } else {
    if (typeof config[key] !== type) {
      throw new HardhatPluginError(PLUGIN_NAME, `\`${key}\` config must be a ${type}`);
    }
  }
}

extendConfig(function (config, userConfig) {
  config.bytecodeExporter = [userConfig.bytecodeExporter].flat().map(function (el) {
    const conf = Object.assign({}, DEFAULT_CONFIG, el);
    validate(conf, 'path', 'string');
    validate(conf, 'runOnCompile', 'boolean');
    validate(conf, 'clear', 'boolean');
    validate(conf, 'flat', 'boolean');
    validate(conf, 'only', 'array');
    validate(conf, 'except', 'array');
    validate(conf, 'spacing', 'number');

    if (conf.flat && typeof conf.rename !== 'undefined') {
      throw new HardhatPluginError(PLUGIN_NAME, '`flat` & `rename` config cannot be specified together');
    }

    if (conf.flat) {
      conf.rename = (_, contractName) => contractName;
    }

    if (!conf.rename) {
      conf.rename = (sourceName, contractName) => path.join(sourceName, contractName);
    }

    validate(conf, 'rename', 'function');

    return conf;
  });
});
