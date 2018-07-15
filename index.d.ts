import sequelize from "sequelize";

declare module 'egg' {

  // extend app
  interface Application {
    Sequelize: sequelize.SequelizeStatic;
    sequelize: sequelize.Sequelize;
  }

  // extend context
  interface Context {
    sequelize: sequelize.Sequelize;
  }

  // extend your config
  interface EggAppConfig {
    sequelize: sequelize.Options;
  }

}