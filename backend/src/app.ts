import express from 'express';
import cors from 'cors';
import botRoutes from './routes/botRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bot', botRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});