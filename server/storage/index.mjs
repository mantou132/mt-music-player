import upyun from 'upyun';
import config from 'config';
import crypto from 'crypto';

const service = new upyun.Service(
  config.get('upyun.name'),
  config.get('upyun.operator'),
  config.get('upyun.password'),
);

const client = new upyun.Client(service);

export default {
  async putFile(file) {
    const hash = crypto.createHash('sha256');
    hash.update(file);
    const path = hash.digest('hex');
    const exist = await client.headFile(path);
    if (!exist) await client.putFile(path, file);
    return path;
  },
};
