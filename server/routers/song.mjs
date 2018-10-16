import mm from 'music-metadata';
import crypto from 'crypto';
import Models from '../models/index.mjs';
import sequelize from '../db/postgres';
import upyunClient from '../storage/index.mjs';

export async function create(req, res) {
  const file = req.files[0];
  const { common: tags, format } = await mm.parseBuffer(file.buffer);

  const hash = crypto.createHash('sha256');
  hash.update(file.buffer);
  const src = hash.digest('hex');
  const exist = await upyunClient.headFile(src);
  if (!exist) await upyunClient.putFile(src, file.buffer);

  let picture = '';
  if (tags.picture) {
    const hash1 = crypto.createHash('sha256');
    hash1.update(tags.picture);
    picture = hash1.digest('hex');
    const exist1 = await upyunClient.headFile(picture);
    if (!exist1) upyunClient.putFile(picture, tags.picture);
  }

  const transaction = await sequelize.transaction();
  let data;
  try {
    data = Models.song.build(
      {
        title: tags.title || file.originalname,
        releaseYear: tags.year,
        artist: tags.artist,
        album: tags.album,
        duration: format.duration,
        user: req.header('x-user'),
        src,
        picture,
      },
      { transaction },
    );
    await data.save();
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    return res.send(500);
  }

  return res.status(200).json(data);
}

export async function update(req, res) {
  const file = req.files && req.files[0];
  const id = Number(req.param('id'));
  if (!id) return res.send(400);

  let picture;
  if (file) {
    const hash = crypto.createHash('sha256');
    hash.update(file);
    picture = hash.digest('hex');
    const exist = await upyunClient.headFile(picture);
    if (!exist) upyunClient.putFile(picture, file);
  }

  const user = req.header('x-user') || null;

  try {
    await Models.song.update(
      { ...req.body, picture },
      {
        where: { user, id },
      },
    );
  } catch (e) {
    return res.send(400);
  }

  return res.status(200).json({ message: 'OK' });
}

export async function remove(req, res) {
  const id = Number(req.param('id'));
  if (!id) return res.send(400);

  const user = req.header('x-user') || null;

  try {
    await Models.song.destroy({
      where: { user, id },
    });
  } catch (e) {
    return res.send(400);
  }

  return res.status(200).json({ message: 'OK' });
}

export async function get(req, res) {
  const list = await Models.song.findAll({
    where: {
      user: req.header('x-user') || null,
    },
    order: [['id', 'DESC']],
  });
  res.status(200).json(list);
}
