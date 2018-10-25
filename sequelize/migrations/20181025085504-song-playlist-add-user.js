module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('song_playlists', 'user', {
    type: Sequelize.STRING,
  }),

  down: queryInterface => queryInterface.removeColumn('song_playlists', 'user'),
};
