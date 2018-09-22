const app = require('src/app');
const { logger } = require('src/utils/logger');

const server = app.listen(app.get('port'), () => {
  logger.info(`✓ App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode
  Press CTRL-C to stop`);
});


process.on('uncaughtException', (e) => {
  logger.debug('uncaught exception:', e);
  server.close();
  process.exit(1);
});

process.on('unhandledRejection', (e) => {
  logger.debug('unhandled rejection:', e);
  server.close();
  process.exit(1);
});
