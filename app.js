'use strict';

module.exports = app => {
  if (app.config.sequelize.app) require('./lib/modelLoader')(app);
};

