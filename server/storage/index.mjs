import upyun from 'upyun';
import config from 'config';

const service = new upyun.Service(
  config.get('upyun.name'),
  config.get('upyun.operator'),
  config.get('upyun.password'),
);

export default new upyun.Client(service);
