module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('songs', 'star', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    }),

  down: queryInterface => queryInterface.removeColumn('songs', 'star'),
};
