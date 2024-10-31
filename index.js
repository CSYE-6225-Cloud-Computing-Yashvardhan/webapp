const express = require('express');
const app = express();
const healthzRoute = require('./routes/healthzRoute.js');
const userRoute = require("./routes/userRoute.js");
const statsd = require('./utils/statsD.js');
const { logger } = require('./utils/logger');

app.use((req, res, next) => {
  const start = Date.now();
  statsd.increment(`api.${req.method}.${req.originalUrl}.count`);
  logger.info(`API Call Started: ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
      const duration = Date.now() - start;
      statsd.timing(`api.${req.method}.${req.originalUrl}.duration`, duration);
      logger.info(`API Call Completed: ${req.method} ${req.originalUrl}, Duration: ${duration}ms`);
  });
  next();
});


const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/healthz', healthzRoute);
app.use('/v1/user', userRoute);
app.use('/', (req, res) => {
    res.status(404).header('Cache-Control', 'no-cache').header('Pragma', 'no-cache').send();
});

/*app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/

module.exports = app;
