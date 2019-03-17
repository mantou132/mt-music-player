import { getSrc, getAbbrPinyin } from '../../utils/misc.js';
import { transformTextToBitmap } from '../../utils/canvas.js';

const emptyFunction = () => {};

const mediaSession = {
  async setMetadata({ title, artist, album, picture }) {
    if ('mediaSession' in navigator) {
      const metadata = { title };

      if (artist) metadata.artist = artist;
      if (album) metadata.album = album;
      const src = picture || transformTextToBitmap(await getAbbrPinyin(title));
      metadata.artwork = [
        {
          src: getSrc(src),
        },
      ];

      navigator.mediaSession.metadata = new window.MediaMetadata(metadata);
      navigator.mediaSession.setActionHandler('play', mediaSession.onplay);
      navigator.mediaSession.setActionHandler('pause', mediaSession.onpause);
      // navigator.mediaSession.setActionHandler('seekbackward', mediaSession.onseekbackward);
      // navigator.mediaSession.setActionHandler('seekforward', mediaSession.onseekforward);
      navigator.mediaSession.setActionHandler(
        'previoustrack',
        mediaSession.onprevioustrack,
      );
      navigator.mediaSession.setActionHandler(
        'nexttrack',
        mediaSession.onnexttrack,
      );
    }
  },
  onplay: emptyFunction,
  onpause: emptyFunction,
  onseekbackward: emptyFunction,
  onseekforward: emptyFunction,
  onprevioustrack: emptyFunction,
  onnexttrack: emptyFunction,
};

export default mediaSession;
