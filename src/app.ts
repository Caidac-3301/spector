import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as hbs from 'express-handlebars';
import * as path from 'path';
import logger from './utils/logger';
import router from './routes';

type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;

// Create Express server
const app = express();

// View Engine setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'base',
    layoutsDir: `${__dirname}/views/layouts/`
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)

app.use('/static', express.static(path.join(__dirname, 'public')))

// ping
app.get('/', (req: Request, res: Response) => {
    res.render('index', { title: 'Home' });
});
app.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Ping received successfully at ${new Date()}`);
    res.send('Pong');
});


export default app;
