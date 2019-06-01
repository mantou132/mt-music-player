import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routers';

const app = express();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', cors(), routes);
app.use('/', express.static('fe'));
app.use((req, res) => res.sendFile('./fe/index.html'));

const server = http.createServer(app);

server.listen(process.env.PORT || 7749, '0.0.0.0', () => {
  console.info(
    `server started on \`http://localhost:${process.env.PORT || 7749}\``,
  );
});
const onClose = () => {
  server.close(() => {
    process.exit();
  });
};
process.on('SIGINT', onClose);
process.on('SIGTERM', onClose);
