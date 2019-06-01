import Sequelize from 'sequelize';
import mm from 'music-metadata';
import Models from '../models';
import sequelize from '../db/postgres';
import upyunClient from '../storage';

const { like, or, and } = Sequelize.Op;

export async function create(req, res) {
  const file = req.files[0];
  const [{ common: tags, format }, src] = await Promise.all([
    mm.parseBuffer(file.buffer),
    upyunClient.putFile(file.buffer, { 'content-type': file.mimetype }),
  ]);

  let picture;
  if (tags.picture) {
    picture = await upyunClient.putFile(tags.picture);
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
  const id = Number(req.params.id);
  if (!id) return res.send(400);

  let picture;
  if (file) {
    picture = await upyunClient.putFile(file.buffer);
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

  const data = await Models.song.findOne({
    where: { user, id },
  });
  return res.status(200).json(data);
}

export async function remove(req, res) {
  const id = Number(req.params.id);
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
  const { album, artist } = req.query;
  const condition = {
    attributes: { exclude: ['user'] },
    where: {
      user: req.header('x-user') || null,
      [and]: [],
    },
    order: [['id', 'DESC']],
  };
  if (album !== undefined) {
    condition.where[and].push({ album });
  }
  if (artist !== undefined) {
    condition.where[and].push({ artist });
  }
  const list = await Models.song.findAll(condition);
  res.status(200).json(list);
}

export async function search(req, res) {
  const q = `%${req.query.q}%`;
  const list = await Models.song.findAll({
    where: {
      user: req.header('x-user') || null,
      [or]: [
        { title: { [like]: q } },
        { album: { [like]: q } },
        { artist: { [like]: q } },
      ],
    },
    order: [['id', 'DESC']],
  });
  res.status(200).json(list);
}
