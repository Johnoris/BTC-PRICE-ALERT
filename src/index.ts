import express, { Request, Response } from 'express';
import cors from 'cors';
import alertsRouter from './routes/alerts';

const app = express()
const PORT = 9000;

app.use('/alerts', alertsRouter);

app.use(cors())
app.get('/',(req: Request, res: Response) => { res.send('Hello world!') })
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});