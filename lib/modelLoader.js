'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const chalk = require('chalk');

Sequelize.prototype.log = function() {
  if (this.options.logging === false) return;
  const args = Array.prototype.slice.call(arguments);
  let sql = args[0].replace(/Executed \(.+?\):\s{0,1}/, '');
  if (args[2] && args[2].bind) { // repleace ? with parameter
    let i = 0;
    sql = sql.replace(/\?/g, () => `'${args[2].bind[i++] || '?'}'`);
  }
  this.options.logging.info('[model]', chalk.magenta(sql), `(${args[1]}ms)`);
};

module.exports = app => {
  const { load } = app.config.sequelize;

  app.Sequelize = Sequelize;
  app.addSingleton('sequelize', createModel);
  loadModel(load || {});

  function createModel(config, app) {
    config = Object.assign({
      logging: app.logger,
      benchmark: true,
      define: {
        freezeTableName: false,
        underscored: true,
      },
    }, config);
    const model = new Sequelize(config.database, config.username, config.password, config);
    app.beforeStart(async () => { await model.authenticate(); });
    return model;
  }

  function loadModel(options) {
    const { loader } = app;
    options = Object.assign({
      inject: app,
      caseStyle: 'upper',
      ignore: 'index.js',
      directory: path.join(app.options.baseDir, 'app/model'),
    }, options);
    loader.loadToApp(options.directory, 'model', options);

    for (const name of Object.keys(app.model)) {
      const klass = app.model[name];
      if ('associate' in klass) klass.associate();
    }
  }
};
