import express from 'express';
import cors from 'cors';
import botRoutes from './routes/botRoutes.js';
import callRoutes from './routes/callRoutes.js';
import hookRoutes from './routes/hookRoutes.js'
import type { Request, Response } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bot', botRoutes);
app.use('/api/call', callRoutes);
app.use('/webhook', hookRoutes);

app.get('/health', (req: Request, res: Response)=>{
  res.status(200);
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});