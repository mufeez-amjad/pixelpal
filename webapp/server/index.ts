import express, { Application } from 'express';
import knex, { Knex } from 'knex';

const app: Application = express();
app.use(express.json());

const db: Knex = knex({
  client: 'postgres',
  connection: 'postgres://test:test@localhost:5432/pixelpal',
});

app.post('/api/auth', async (req, res) => {
  console.log(req.body);
  const { ppid, address, signature } = req.body;

  // TODO: verify signature
  
  // TODO: check if address already registered, if so
  //       give user special flow "we noticed your address has been registered
  //       on a different device" or something and link new device

  await db('users').insert({ ppid, address });
  res.send('ok!');
});

app.listen(process.env.PORT || 3001, () => {
  console.log('server started on port 3001');
});
