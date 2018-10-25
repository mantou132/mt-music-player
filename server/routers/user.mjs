import Models from '../models';
import upyunClient from '../storage';

export async function login(req, res) {
  const user = req.header('x-user');
  if (!user) return res.send(400);

  const data = await Models.user.findOrCreate({
    where: {
      key: req.header('x-user'),
    },
  });
  return res.status(200).json(data);
}

export async function update(req, res) {
  const file = req.files && req.files[0];
  const user = req.header('x-user');
  if (!user) return res.send(400);

  let avatar;
  if (file) {
    avatar = await upyunClient.putFile(file.buffer);
  }

  const data = await Models.user.findOne({
    where: { key: user },
  });

  await data.update({
    ...req.body,
    avatar,
  });

  return res.status(200).json(data);
}

export async function remove(req, res) {
  const user = req.header('x-user');
  if (!user) return res.send(400);

  try {
    await Models.user.destroy({
      where: { key: user },
    });
  } catch (e) {
    return res.send(400);
  }

  return res.status(200).json({ message: 'OK' });
}
