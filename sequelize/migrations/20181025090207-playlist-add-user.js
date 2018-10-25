module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('playlists', 'user', {
    type: Sequelize.STRING,
  }),

  down: queryInterface => queryInterface.removeColumn('playlists', 'user'),
};
