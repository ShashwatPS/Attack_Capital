import express from 'express';
import cors from 'cors';
import botRoutes from './routes/botRoutes.js';
import callRoutes from './routes/callRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bot', botRoutes);
app.use('/api/call', callRoutes)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});