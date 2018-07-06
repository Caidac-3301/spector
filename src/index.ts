import app from './app';

// Error Handler. Provides full stack traces and internal details
if (app.get('env') === 'development') {
    const errorHandler = require('errorhandler');
    app.use(errorHandler());
}

// Start Express server.
const server = app.listen(app.get('port'), () => {
    console.log(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
    console.log(`Press CTRL-C to stop\n`);
});

export default server;
