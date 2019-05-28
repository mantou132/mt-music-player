import Models from '../models';
import upyunClient from '../storage';

export async function create(req, res) {
  const file = req.files && req.files[0];
  let image;
  if (file) {
    image = await upyunClient.putFile(file.buffer);
  }
  const data = Models.playlist.build({
    user: req.header('x-user') || null,
    title: req.body.title,
    image,
  });
  await data.save();

  return res.status(200).json(data);
}

export async function update(req, res) {
  const file = req.files && req.files[0];
  const id = Number(req.param('id'));
  if (!id) return res.send(400);

  let image;
  if (file) {
    image = await upyunClient.putFile(file.buffer);
  }

  try {
    const data = await Models.playlist.findOne({
      where: { user: req.header('x-user') || null, id },
    });
    await data.update({ ...req.body, image });
    return res.status(200).json(data);
  } catch (e) {
    return res.send(400);
  }
}

export async function remove(req, res) {
  const id = Number(req.param('id'));
  if (!id) return res.send(400);

  try {
    await Models.playlist.destroy({
      where: { user: req.header('x-user') || null, id },
    });
  } catch (e) {
    return res.send(400);
  }

  return res.status(200).json({ message: 'OK' });
}

export async function get(req, res) {
  const list = await Models.playlist.findAll({
    attributes: { exclude: ['user'] },
    where: {
      user: req.header('x-user') || null,
    },
    order: [['id', 'DESC']],
  });
  res.status(200).json(list);
}

export async function getSongs(req, res) {
  const list = await Models.playlist.findOne({
    include: [
      {
        model: Models.song,
        through: {
          attributes: [],
        },
        attributes: { exclude: ['user'] },
      },
    ],
    attributes: { exclude: ['user'] },
    where: {
      user: req.header('x-user') || null,
      id: Number(req.param('id')),
    },
    order: [['id', 'DESC']],
  });
  res.status(200).json(list);
}

export async function addSong(req, res) {
  const playlist = await Models.playlist.findOrCreate({
    where: {
      user: req.header('x-user') || null,
      playlistId: Number(req.param('id')),
    },
  });

  const data = await playlist.addSong(Number(req.param('songId')));
  return res.status(200).json(data);
}

export async function removeSong(req, res) {
  await Models.song_playlist.destroy({
    where: {
      user: req.header('x-user') || null,
      playlistId: Number(req.param('id')),
      songId: Number(req.param('songId')),
    },
  });

  return res.status(200).json({ message: 'OK' });
}
