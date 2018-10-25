import express from 'express';
import multer from 'multer';
import '../models';
import * as Song from './song';
import * as User from './user';
import * as Playlist from './playlist';

const router = express.Router();
const upload = multer();

router.post('/login', User.login);
router.put('/account', User.update);
router.delete('/account', User.remove);

router.get('/songs', Song.get);
router.post('/songs', upload.any(), Song.create);
router.delete('/songs/:id', Song.remove);
router.put('/songs/:id', upload.any(), Song.update);

router.get('/playlist', Playlist.get);
router.post('/playlist', upload.any(), Playlist.create);
router.delete('/playlist/:id', Playlist.remove);
router.put('/playlist/:id', upload.any(), Playlist.update);

router.get('/playlist/:id/songs', Playlist.getSongs);
router.post('/playlist/:id/songs/:songId', Playlist.addSong);
router.delete('/playlist/:id/songs/:songId', Playlist.removeSong);

router.get('/search', Song.search);

export default router;
