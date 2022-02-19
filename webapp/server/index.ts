import express, { Application } from 'express';
import knex, { Knex } from 'knex';
import { AuthHandler } from './handlers/auth';
import { NFTHandler } from './handlers/nfthandler';
import { handle } from './handlers/helpers';
import { config } from './config/config';

const app: Application = express();
app.use(express.json());

const db: Knex = knex(config.db);

const authHandler = new AuthHandler(db);
const nftHander = new NFTHandler(db);

app.post('/auth', handle(authHandler.registerPublicKey.bind(authHandler)));
app.get('/nft/:ppid', handle(nftHander.getPixelpalsForPPID.bind(nftHander)));

if (require.main === module) {
	app.listen(config.port, () => {
		console.log(`server started on port ${config.port}`);
	});
}
