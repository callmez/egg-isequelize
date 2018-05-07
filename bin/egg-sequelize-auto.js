#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const config = require('../lib/database');

const client = config.development.clients ? Object.values(config.development.clients).shift() : config.development.client;
const eggSequelizeRoot = __dirname;
let sequelizeAutoRoot = path.resolve(eggSequelizeRoot, '../node_modules/sequelize-auto');
if (!fs.existsSync(sequelizeAutoRoot)) {
  sequelizeAutoRoot = './node_modules/sequelize-auto';
}
const sequelizeAutoBin = path.resolve(sequelizeAutoRoot, './bin/sequelize-auto');
const args = [
  sequelizeAutoBin,
  '--dialect',
  client.dialect,
  '-h',
  client.host,
  '-d',
  client.database,
  '-u',
  client.username,
  '-x',
  client.password,
  '-o',
  'app/model',
].concat(process.argv.slice(2));

child_process.spawn(process.argv[0], args, { stdio: 'inherit' });
