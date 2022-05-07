import express, { Application } from 'express';
import knex, { Knex } from 'knex';
import { AuthHandler } from './handlers/auth';
import { NFTHandler } from './handlers/nfthandler';
import { handle } from './handlers/helpers';
import { config } from './config/config';
import cors from 'cors';
import path from 'path';

const app: Application = express();
app.use(express.json());
app.use(cors());

const db: Knex = knex(config.db);

const authHandler = new AuthHandler(db);
const nftHander = new NFTHandler(db);

app.use(express.static(path.join(__dirname, 'build')));

app.post('/auth', handle(authHandler.registerPublicKey.bind(authHandler)));
app.get('/nft/:ppid', handle(nftHander.getPixelpalsForPPID.bind(nftHander)));
app.get('/ping', (_req, res) => {
	res.status(200).json({ 'message': 'pong!' });
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

if (require.main === module) {
	app.listen(config.port, () => {
		console.log(`server started on port ${config.port}`);
	});
}
