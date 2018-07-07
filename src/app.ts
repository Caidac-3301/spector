import * as bodyParser from 'body-parser';
import * as express from 'express';
import logger from './utils/logger';
import router from './routes';

type Request = express.Request;
type Response = express.Response;

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)

// ping
app.get('/', (req: Request, res: Response) => {
    res.redirect(302, '/ping');
});
app.get('/ping', (req: Request, res: Response) => {
    logger.info(`Ping received successfully at ${new Date()}`);
    res.send('Pong');
});


export default app;
