import express, { Application } from 'express';
import knex, { Knex } from 'knex';
import { AuthHandler } from './handlers/auth';
import { NFTHandler } from './handlers/nfthandler';
import { handle } from './handlers/helpers';

const app: Application = express();
app.use(express.json());

// TODO: move to config
const db: Knex = knex({
	client: 'postgres',
	connection: 'postgres://test:test@localhost:5432/pixelpal'
});

const authHandler = new AuthHandler(db);
const nftHander = new NFTHandler(db);

app.post('/auth', handle(authHandler.registerPublicKey.bind(authHandler)));
app.get('/nft/:ppid', handle(nftHander.getPixelpalsForPPID.bind(nftHander)));

if (require.main === module) {
	app.listen(process.env.PORT || 3001, () => {
		console.log('server started on port 3001');
	});
}
