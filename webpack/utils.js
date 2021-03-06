/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const rimraf = require('rimraf');
const semver = require('semver');
const childProcess = require('child_process');
const config = require('../config');
const packageConfig = require('../package.json');
const isRun = process.env.NODE_ACTION === 'run';
const isProd = process.env.NODE_ENV === 'production';

const rm = p => new Promise((resolve, reject) => {
  rimraf(p, e => (e ? reject(e) : resolve()));
});

const fullPath = s => path.join(__dirname, '..', s);

const formatDistributionAssetsPath = (s) => {
  if (config.distributionAssetsDirectory) {
    return path.posix.join(config.distributionAssetsDirectory, s || '');
  }
  return s || '';
};

const regexEscape = s => s.replace(/[[\]{}()*+!<=:?.\\^$|#\s,]/g, '\\$&');

const checkVersions = () => {
  function exec(cmd) {
    return childProcess.execSync(cmd).toString().trim();
  }

  const versionRequirements = [
    {
      name: 'node',
      currentVersion: semver.clean(process.version),
      versionRequirement: packageConfig.engines.node,
    },
  ];

  if (shell.which('npm')) {
    versionRequirements.push({
      name: 'npm',
      currentVersion: exec('npm --version'),
      versionRequirement: packageConfig.engines.npm,
    });
  }

  const warnings = [];
  versionRequirements.forEach((mod) => {
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(`${mod.name}: ${
        chalk.red(mod.currentVersion)} should be ${
        chalk.green(mod.versionRequirement)}`);
    }
  });

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('To use this template, you must update following to modules:'));
    console.log();
    warnings.forEach((warning) => {
      console.log(`  ${warning}`);
    });
    console.log();
    process.exit(1);
  }
};

exports.isRun = isRun;
exports.isProd = isProd;
exports.rm = rm;
exports.fullPath = fullPath;
exports.formatDistributionAssetsPath = formatDistributionAssetsPath;
exports.regexEscape = regexEscape;
exports.checkVersions = checkVersions;
