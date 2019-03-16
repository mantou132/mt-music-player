export default {
  HOME: {
    path: '/',
    title: 'MT Music Player',
  },
  SONGS: {
    path: '/songs',
    title: 'songs',
    getSubPageTitle: (subPage, title) => `${subPage} - ${title}`,
  },
  PLAYLIST: {
    path: '/playlist',
    title: 'playlist',
  },
  FAVORITES: {
    path: '/favorites',
    title: 'favorites',
  },
  SEARCH: {
    path: '/search',
    title: 'search',
  },
  ALBUMS: {
    path: '/albums',
    title: 'albums',
    subTitle: 'album',
  },
  ARTISTS: {
    path: '/artists',
    title: 'artists',
    subTitle: 'artist',
  },
  PLAYLISTS: {
    path: '/playlists',
    title: 'playlists',
    getSubPageTitle: title => `playlist - ${title}`,
  },
  404: {
    title: 'not found',
  },
};
