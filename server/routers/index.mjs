import express from 'express';
import multer from 'multer';
import '../models';
import * as Song from './song';
import * as User from './user';
import * as Album from './album';
import * as Artist from './artist';

const router = express.Router();
const upload = multer();

// router.post('/login', User.login);
// router.post('/register', User.register);

router.get('/songs', Song.get);
router.post('/songs', upload.any(), Song.create);
router.delete('/songs/:id', Song.remove);
router.put('/songs/:id', upload.any(), Song.update);

router.get('/search', Song.search);

// router.get('/albums', Album);
// router.put('/albums/:id', Album);

// router.get('/artist', Artist.create);
// router.put('/artist/:id', Artist.update);

export default router;
