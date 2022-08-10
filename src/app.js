import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.use(routes);

app.use((error, req, res, next) => {
  console.log(error);
  return res.status(500).json({ message: error.message });
});

export default app;
