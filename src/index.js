import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

import config from './config';
import authRouter from './spotify/auth/routes';
import usersApi from './api/controllers/users';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/auth', authRouter);
app.use(usersApi);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = http.createServer(app);
const port = config.host.port;

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
