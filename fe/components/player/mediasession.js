import { getSrc } from '../../utils/misc.js';
import { transformSVGDataURLToBitmap } from '../../utils/canvas.js';
import Image from '../image/index.js';

const emptyFunction = () => {};

const getPicture = async title =>
  transformSVGDataURLToBitmap(await Image.getAltPlaceholder(title));

const mediaSession = {
  async setMetadata({ title, artist, album, picture }) {
    if ('mediaSession' in navigator) {
      const metadata = { title };

      if (artist) metadata.artist = artist;
      if (album) metadata.album = album;
      const src = picture || (await getPicture(title));
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
