import express from 'express';
import multer from 'multer';
import asyncHandler from 'express-async-handler';
import '../models';
import * as Song from './song';
import * as User from './user';
import * as Playlist from './playlist';

const router = express.Router();
const upload = multer();

router.post('/login', asyncHandler(User.login));
router.put('/account', asyncHandler(User.update));
router.delete('/account', asyncHandler(User.remove));

router.get('/songs', asyncHandler(Song.get));
router.post('/songs', upload.any(), asyncHandler(Song.create));
router.delete('/songs/:id', asyncHandler(Song.remove));
router.put('/songs/:id', upload.any(), asyncHandler(Song.update));

router.get('/playlist', asyncHandler(Playlist.get));
router.post('/playlist', upload.any(), asyncHandler(Playlist.create));
router.delete('/playlist/:id', asyncHandler(Playlist.remove));
router.put('/playlist/:id', upload.any(), asyncHandler(Playlist.update));

router.get('/playlist/:id/songs', asyncHandler(Playlist.getSongs));
router.post('/playlist/:id/songs/:songId', asyncHandler(Playlist.addSong));
router.delete('/playlist/:id/songs/:songId', asyncHandler(Playlist.removeSong));

router.get('/search', asyncHandler(Song.search));

export default router;
