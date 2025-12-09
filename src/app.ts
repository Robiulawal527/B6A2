import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Application Routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Vehicle Rental System API is running',
    });
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Handler
app.use(notFound);

export default app;
