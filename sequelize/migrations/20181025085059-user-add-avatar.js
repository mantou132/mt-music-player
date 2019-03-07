module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING,
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'avatar'),
};
